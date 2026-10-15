import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Send, Plus } from 'lucide-react';
import { CommunityPost, SubjectType } from '../types';
import { sound } from '../utils/audio';

interface CommunityViewProps {
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'upvotes' | 'replies'>) => void;
  onUpvotePost: (postId: string) => void;
  onAddReply: (postId: string, text: string) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  posts,
  onAddPost,
  onUpvotePost,
  onAddReply,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectType>('languages');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  const filteredPosts =
    selectedSubject === 'all'
      ? posts
      : posts.filter((p) => p.subject === selectedSubject);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    sound.playLevelUp();
    onAddPost({
      authorName: 'Alex Explorer',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      authorBadge: '⭐ TudoLearn Scholar',
      subject: newSubject,
      title: newTitle.trim(),
      content: newContent.trim(),
    });

    setNewTitle('');
    setNewContent('');
    setShowCreateModal(false);
  };

  const handleSendReply = (postId: string) => {
    const text = replyTextMap[postId];
    if (!text || !text.trim()) return;
    sound.playClick();
    onAddReply(postId, text.trim());
    setReplyTextMap({ ...replyTextMap, [postId]: '' });
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-24">
      {/* Header Banner with Blue/Indigo/Sky Palette */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-500 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/10 mb-6 flex items-center justify-between border border-blue-400/20">
        <div>
          <h1 className="text-2xl font-black">TudoLearn Community</h1>
          <p className="text-xs text-blue-100 font-semibold mt-1">
            Exchange mnemonics, study tips, and challenge questions with learners.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setShowCreateModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 rounded-2xl font-black text-xs uppercase shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Filter Tabs (Flows Downward, No Horizontal Scrolling) */}
      <div className="flex flex-wrap gap-1.5 pb-2 mb-4">
        {['all', 'informatics', 'languages', 'mathematics', 'music', 'science', 'coding', 'psychology'].map((sub) => (
          <button
            key={sub}
            onClick={() => {
              sound.playClick();
              setSelectedSubject(sub);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black capitalize whitespace-nowrap transition-all cursor-pointer ${
              selectedSubject === sub
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white border-2 border-slate-200 hover:border-blue-200 rounded-3xl p-5 shadow-xs transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <span>{post.authorName}</span>
                    {post.authorBadge && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.2 rounded-full font-bold">
                        {post.authorBadge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{post.createdAt}</span>
                </div>
              </div>

              <span className="text-[10px] uppercase font-black px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                {post.subject}
              </span>
            </div>

            <h3 className="text-base font-black text-slate-900 mb-1.5">{post.title}</h3>
            <p className="text-xs font-medium text-slate-600 leading-relaxed mb-4">
              {post.content}
            </p>

            {/* Actions Bar */}
            <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onUpvotePost(post.id);
                }}
                className={`flex items-center gap-1.5 text-xs font-black transition-colors cursor-pointer ${
                  post.hasUpvoted ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${post.hasUpvoted ? 'fill-blue-600' : ''}`} />
                <span>{post.upvotes}</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs font-black text-slate-500">
                <MessageSquare className="w-4 h-4" />
                <span>{post.replies.length} replies</span>
              </div>
            </div>

            {/* Existing Replies */}
            {post.replies.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                {post.replies.map((reply) => (
                  <div key={reply.id} className="bg-slate-50 rounded-2xl p-3 flex gap-2.5">
                    <img
                      src={reply.avatar}
                      alt={reply.authorName}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div>
                      <div className="text-[11px] font-black text-slate-800">
                        {reply.authorName}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">{reply.content}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Reply Input */}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replyTextMap[post.id] || ''}
                onChange={(e) => setReplyTextMap({ ...replyTextMap, [post.id]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleSendReply(post.id)}
                placeholder="Write a helpful response..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => handleSendReply(post.id)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border-2 border-blue-200">
            <h2 className="text-xl font-black text-slate-800 mb-4">Start Discussion</h2>
            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="text-xs font-black uppercase text-slate-500">Subject</label>
                <select
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value as SubjectType)}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-black"
                >
                  <option value="languages">Languages</option>
                  <option value="informatics">Informatics & Computers</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="music">Music</option>
                  <option value="science">Science</option>
                  <option value="coding">Coding</option>
                  <option value="psychology">Psychology</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Memory trick for treble clef notes"
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-500">Content</label>
                <textarea
                  required
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share your tips, questions, or mnemonic techniques..."
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl border-b-2 border-blue-900 active:border-b-0 cursor-pointer shadow-sm"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
