/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { COURSES_DATA } from './data/coursesData';
import {
  getUserProfile,
  saveUserProfile,
  getCommunityPosts,
  saveCommunityPosts,
  INITIAL_LEADERBOARD,
} from './utils/storage';
import {
  auth,
  signInWithGoogle,
  logOut,
  syncUserProfileToFirestore,
  fetchUserProfileFromFirestore,
} from './utils/firebase';
import { Course, LessonNode, SubjectType, CommunityPost, LeaderboardUser } from './types';
import { HeaderNav } from './components/HeaderNav';
import { NavigationDock, TabType } from './components/NavigationDock';
import { LearningPath } from './components/LearningPath';
import { LessonModal } from './components/LessonModal';
import { LeaderboardView } from './components/LeaderboardView';
import { BadgesView } from './components/BadgesView';
import { ShopView } from './components/ShopView';
import { CommunityView } from './components/CommunityView';
import { AnalyticsView } from './components/AnalyticsView';
import { TeacherStudio } from './components/TeacherStudio';
import { AiTutorModal } from './components/AiTutorModal';
import { AiToolsModal } from './components/AiToolsModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { CertificateModal } from './components/CertificateModal';
import { OnboardingModal } from './components/OnboardingModal';
import { sound } from './utils/audio';

export default function App() {
  const [user, setUser] = useState(() => getUserProfile());
  const [courses, setCourses] = useState<Course[]>(COURSES_DATA);
  const [currentTab, setCurrentTab] = useState<TabType>('learn');
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => getCommunityPosts());
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);

  // Firebase user state
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Modals state
  const [activeLesson, setActiveLesson] = useState<LessonNode | null>(null);
  const [showAiTutor, setShowAiTutor] = useState(false);
  const [showAiTools, setShowAiTools] = useState(false);
  const [showSuperModal, setShowSuperModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateCourse, setCertificateCourse] = useState<Course | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);

  // Listen to Firebase Auth state & sync with Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        // Fetch persisted profile from Firestore
        const remoteProfile = await fetchUserProfileFromFirestore(currentUser.uid);
        if (remoteProfile) {
          setUser((prev) => ({
            ...prev,
            ...remoteProfile,
            name: currentUser.displayName || prev.name,
            email: currentUser.email || prev.email,
            avatar: currentUser.photoURL || prev.avatar,
          }));
        } else {
          // First time sign-in: sync current state to Firestore
          await syncUserProfileToFirestore(currentUser.uid, {
            ...user,
            id: currentUser.uid,
            name: currentUser.displayName || user.name,
            email: currentUser.email || user.email,
            avatar: currentUser.photoURL || user.avatar,
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync user profile to localStorage & Firestore if signed in
  useEffect(() => {
    saveUserProfile(user);
    if (firebaseUser) {
      syncUserProfileToFirestore(firebaseUser.uid, user);
    }
  }, [user, firebaseUser]);

  // Sync community posts to localStorage
  useEffect(() => {
    saveCommunityPosts(communityPosts);
  }, [communityPosts]);

  // Heart regeneration timer (every 10 minutes if below maxHearts and not Super)
  useEffect(() => {
    if (user.isSuper || user.hearts >= user.maxHearts) return;

    const interval = setInterval(() => {
      setUser((prev) => {
        if (prev.hearts < prev.maxHearts) {
          return { ...prev, hearts: prev.hearts + 1, lastHeartTimestamp: Date.now() };
        }
        return prev;
      });
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user.hearts, user.isSuper, user.maxHearts]);

  // Current active course
  const currentCourse =
    courses.find((c) => c.id === user.currentCourseId) || courses[0];

  // Course selector handler
  const handleSelectCourse = (course: Course) => {
    setUser((prev) => ({
      ...prev,
      currentCourseId: course.id,
      currentSubject: course.subject,
    }));
  };

  // Google Sign In handler
  const handleSignInGoogle = async () => {
    sound.playClick();
    try {
      const signedInUser = await signInWithGoogle();
      if (signedInUser) {
        sound.playLevelUp();
        confetti({ particleCount: 70, spread: 60 });
      }
    } catch (err: any) {
      console.warn('Sign-in cancelled or note:', err.message);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    sound.playClick();
    await logOut();
    setFirebaseUser(null);
  };

  // Lesson completion handler
  const handleCompleteLesson = (lessonId: string, earnedXp: number) => {
    const isNew = !user.completedLessonIds.includes(lessonId);

    setUser((prev) => {
      const updatedXp = prev.xp + earnedXp;
      const updatedGems = prev.gems + 15;
      const updatedStreak = prev.streak + 1;
      const updatedCompleted = isNew
        ? [...prev.completedLessonIds, lessonId]
        : prev.completedLessonIds;

      // Update badge progress
      const updatedBadges = prev.badges.map((b) => {
        if (b.id === 'badge-xp-1000') {
          return { ...b, progress: Math.min(b.maxProgress, updatedXp) };
        }
        if (b.id === 'badge-flame') {
          return { ...b, progress: Math.min(b.maxProgress, updatedStreak) };
        }
        return b;
      });

      return {
        ...prev,
        xp: updatedXp,
        gems: updatedGems,
        streak: updatedStreak,
        todayMinutes: prev.todayMinutes + 4,
        completedLessonIds: updatedCompleted,
        badges: updatedBadges,
      };
    });

    // Update leaderboard with new XP and streak
    setLeaderboardUsers((prev) =>
      prev.map((u) => (u.isCurrentUser ? { ...u, xp: u.xp + earnedXp, streak: u.streak + 1 } : u))
    );
  };

  // Heart loss handler
  const handleLoseHeart = () => {
    setUser((prev) => ({
      ...prev,
      hearts: Math.max(0, prev.hearts - 1),
    }));
  };

  // Chest gem reward handler
  const handleOpenChest = (gemsBonus: number) => {
    sound.playLevelUp();
    confetti({ particleCount: 80, spread: 60 });
    setUser((prev) => ({
      ...prev,
      gems: prev.gems + gemsBonus,
    }));
  };

  // Shop refill hearts
  const handleRefillHearts = (cost: number) => {
    setUser((prev) => ({
      ...prev,
      gems: prev.gems - cost,
      hearts: prev.maxHearts,
    }));
  };

  // Shop streak freeze
  const handleBuyStreakFreeze = (cost: number) => {
    setUser((prev) => ({
      ...prev,
      gems: prev.gems - cost,
      hasStreakFreeze: true,
    }));
  };

  // Subscribe Super success
  const handleSubscribeSuccess = () => {
    setUser((prev) => {
      const updatedBadges = prev.badges.map((b) =>
        b.id === 'badge-super' ? { ...b, progress: 1, isUnlocked: true } : b
      );
      return {
        ...prev,
        isSuper: true,
        hearts: prev.maxHearts,
        badges: updatedBadges,
      };
    });
  };

  // Claim achievement badge
  const handleClaimBadge = (badgeId: string, gemReward: number) => {
    setUser((prev) => ({
      ...prev,
      gems: prev.gems + gemReward,
      badges: prev.badges.map((b) =>
        b.id === badgeId ? { ...b, isUnlocked: true } : b
      ),
    }));
  };

  // Community discussion handlers
  const handleAddPost = (newPostData: Omit<CommunityPost, 'id' | 'createdAt' | 'upvotes' | 'replies'>) => {
    const post: CommunityPost = {
      ...newPostData,
      id: `p-${Date.now()}`,
      createdAt: 'Just now',
      upvotes: 1,
      hasUpvoted: true,
      replies: [],
    };
    setCommunityPosts([post, ...communityPosts]);
  };

  const handleUpvotePost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const upvoted = !p.hasUpvoted;
          return {
            ...p,
            upvotes: upvoted ? p.upvotes + 1 : p.upvotes - 1,
            hasUpvoted: upvoted,
          };
        }
        return p;
      })
    );
  };

  const handleAddReply = (postId: string, text: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            replies: [
              ...p.replies,
              {
                id: `r-${Date.now()}`,
                authorName: user.name,
                avatar: user.avatar,
                content: text,
                createdAt: 'Just now',
              },
            ],
          };
        }
        return p;
      })
    );
  };

  // Teacher studio: publish course
  const handlePublishCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
    setUser((prev) => ({
      ...prev,
      currentCourseId: newCourse.id,
      currentSubject: newCourse.subject,
    }));
  };

  // Toggle offline downloaded course
  const handleToggleOfflineCourse = (courseId: string) => {
    setUser((prev) => {
      const exists = prev.downloadedCourseIds.includes(courseId);
      return {
        ...prev,
        downloadedCourseIds: exists
          ? prev.downloadedCourseIds.filter((id) => id !== courseId)
          : [...prev.downloadedCourseIds, courseId],
      };
    });
  };

  // Onboarding completion
  const handleFinishOnboarding = (selectedSubject: SubjectType, dailyMinutes: number) => {
    const matchedCourse = courses.find((c) => c.subject === selectedSubject) || courses[0];
    setUser((prev) => ({
      ...prev,
      currentSubject: selectedSubject,
      currentCourseId: matchedCourse.id,
      dailyGoalMinutes: dailyMinutes,
      gems: prev.gems + 100,
    }));
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/20 to-blue-50/30 flex flex-col font-sans">
      {/* Top Header */}
      <HeaderNav
        courses={courses}
        currentCourse={currentCourse}
        onSelectCourse={handleSelectCourse}
        streak={user.streak}
        gems={user.gems}
        hearts={user.hearts}
        todayMinutes={user.todayMinutes}
        dailyGoalMinutes={user.dailyGoalMinutes}
        onUpdateDailyGoal={(minutes) => setUser((prev) => ({ ...prev, dailyGoalMinutes: minutes }))}
        isSuper={user.isSuper}
        isSimulatedOffline={isSimulatedOffline}
        onOpenSuperModal={() => setShowSuperModal(true)}
        onOpenAiTutor={() => setShowAiTutor(true)}
        onOpenAiTools={() => setShowAiTools(true)}
        firebaseUser={firebaseUser}
        onSignInGoogle={handleSignInGoogle}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {currentTab === 'learn' && (
          <LearningPath
            course={currentCourse}
            completedLessonIds={user.completedLessonIds}
            onSelectLesson={(lesson) => setActiveLesson(lesson)}
            onOpenChest={handleOpenChest}
            onOpenAiTutor={() => setShowAiTutor(true)}
          />
        )}

        {currentTab === 'leaderboard' && (
          <LeaderboardView
            users={leaderboardUsers}
            currentUserXp={user.xp}
          />
        )}

        {currentTab === 'community' && (
          <CommunityView
            posts={communityPosts}
            onAddPost={handleAddPost}
            onUpvotePost={handleUpvotePost}
            onAddReply={handleAddReply}
          />
        )}

        {currentTab === 'badges' && (
          <BadgesView
            badges={user.badges}
            onClaimBadge={handleClaimBadge}
          />
        )}

        {currentTab === 'shop' && (
          <ShopView
            gems={user.gems}
            hearts={user.hearts}
            maxHearts={user.maxHearts}
            hasStreakFreeze={user.hasStreakFreeze}
            isSuper={user.isSuper}
            onRefillHearts={handleRefillHearts}
            onBuyStreakFreeze={handleBuyStreakFreeze}
            onOpenSuperModal={() => setShowSuperModal(true)}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            user={user}
            courses={courses}
            onOpenCertificate={(course) => {
              setCertificateCourse(course);
              setShowCertificateModal(true);
            }}
            onToggleOfflineCourse={handleToggleOfflineCourse}
            isSimulatedOffline={isSimulatedOffline}
            onToggleSimulateOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
          />
        )}

        {currentTab === 'studio' && (
          <TeacherStudio
            existingCourses={courses}
            onPublishCourse={handlePublishCourse}
          />
        )}
      </main>

      {/* Navigation Dock */}
      <NavigationDock
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
      />

      {/* Active Lesson Modal */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          isSuper={user.isSuper}
          hearts={user.hearts}
          streak={user.streak}
          onClose={() => setActiveLesson(null)}
          onCompleteLesson={handleCompleteLesson}
          onLoseHeart={handleLoseHeart}
          onOpenSuperModal={() => setShowSuperModal(true)}
        />
      )}

      {/* AI Tutor Assistant Modal */}
      {showAiTutor && (
        <AiTutorModal
          isOpen={showAiTutor}
          onClose={() => setShowAiTutor(false)}
          subject={currentCourse.subject}
          topic={currentCourse.title}
        />
      )}

      {/* Multimodal AI Studio Tools Suite Modal */}
      {showAiTools && (
        <AiToolsModal
          isOpen={showAiTools}
          onClose={() => setShowAiTools(false)}
          currentSubject={currentCourse.title}
        />
      )}

      {/* Super TudoLearn Subscription Modal */}
      {showSuperModal && (
        <SubscriptionModal
          isOpen={showSuperModal}
          onClose={() => setShowSuperModal(false)}
          onSubscribeSuccess={handleSubscribeSuccess}
          isAlreadySuper={user.isSuper}
        />
      )}

      {/* Official Certificate Modal */}
      {showCertificateModal && certificateCourse && (
        <CertificateModal
          isOpen={showCertificateModal}
          onClose={() => setShowCertificateModal(false)}
          studentName={user.name}
          courseTitle={certificateCourse.title}
          subjectName={certificateCourse.subject}
        />
      )}

      {/* Onboarding Diagnostic Modal */}
      {showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          onFinishOnboarding={handleFinishOnboarding}
        />
      )}
    </div>
  );
}
