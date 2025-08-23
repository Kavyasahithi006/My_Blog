import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserAuthorContextObj } from '../../contexts/UserAuthorContext';
import { FaEdit } from 'react-icons/fa';
import { MdDelete, MdRestore } from 'react-icons/md';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import { FaSave } from "react-icons/fa";

function ArticleById() {
  const { state } = useLocation();
  const { currentUser } = useContext(UserAuthorContextObj);
  const [editArticleStatus, setEditArticleStatus] = useState(false);
  const { register, handleSubmit, setValue } = useForm();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [currentArticle, setCurrentArticle] = useState(state);
  const [commentStatus, setCommentStatus] = useState('');

  useEffect(() => {
    if (editArticleStatus) {
      setValue('title', currentArticle.title);
      setValue('category', currentArticle.category);
      setValue('content', currentArticle.content);
    }
  }, [editArticleStatus, setValue, currentArticle]);

  function enabledEdit() {
    setEditArticleStatus(true);
  }

  async function onSave(modifiedArticle) {
    try {
      const token = await getToken();
      if (!token) {
        console.error('Authentication token missing');
        return;
      }
  
      const articleId = currentArticle.articleId || currentArticle._id;
      if (!articleId) {
        console.error('Article ID is missing');
        return;
      }
  
      const modifiedArticleAfterChanges = {
        ...currentArticle,
        ...modifiedArticle,
        dateOfModification: new Date().toLocaleDateString(),
      };
  
      const res = await axios.put(
        `http://localhost:3000/author-api/article/${articleId}`,
        modifiedArticleAfterChanges,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (res.data.message === 'article modified') {
        const updatedArticle = res.data.payload;
        setCurrentArticle(updatedArticle);
        setEditArticleStatus(false);
        
        console.log(`Navigating to: /author-profile/${currentUser.email}/articleId/${articleId}`);
        
        navigate(`/author-profile/${currentUser.email}/articleId/${articleId}`, { 
          state: updatedArticle 
        });
      }
    } catch (error) {
      console.error('Error saving article:', error);
      console.error('Full error details:', error.response?.data || error.message);
    }
  }

  async function deleteArticle() {
    try {
      const token = await getToken();
      if (!token) {
        console.error('Authentication token missing');
        return;
      }

      const articleId = currentArticle.articleId || currentArticle._id;
      if (!articleId) {
        console.error('Article ID is missing');
        return;
      }

      const updatedArticle = { ...currentArticle, isArticleActive: false };

      const res = await axios.put(
        `http://localhost:3000/author-api/articles/${articleId}`,
        updatedArticle,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.message === 'article deleted or restored') {
        setCurrentArticle(res.data.payload);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      console.error('Full error details:', error.response?.data || error.message);
    }
  }

  async function restoreArticle() {
    try {
      const token = await getToken();
      if (!token) {
        console.error('Authentication token missing');
        return;
      }

      const articleId = currentArticle.articleId || currentArticle._id;
      if (!articleId) {
        console.error('Article ID is missing');
        return;
      }

      const updatedArticle = { ...currentArticle, isArticleActive: true };

      const res = await axios.put(
        `http://localhost:3000/author-api/articles/${articleId}`,
        updatedArticle,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.message === 'article deleted or restored') {
        setCurrentArticle(res.data.payload);
      }
    } catch (error) {
      console.error('Error restoring article:', error);
      console.error('Full error details:', error.response?.data || error.message);
    }
  }

  async function addComment(commentObj) {
    try {
      const articleId = currentArticle.articleId || currentArticle._id;
      if (!articleId) {
        console.error('Article ID is missing');
        return;
      }
      
      const commentWithName = {
        ...commentObj,
        nameOfUser: currentUser.firstName
      };
      
      const res = await axios.put(
        `http://localhost:3000/user-api/comment/${articleId}`, 
        commentWithName
      );
      
      if (res.data.message === "comment added") {
        setCommentStatus(res.data.message);
        const updatedArticle = {
          ...currentArticle,
          comments: [...currentArticle.comments, commentWithName]
        };
        setCurrentArticle(updatedArticle);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      console.error('Full error details:', error.response?.data || error.message);
      setCommentStatus('Failed to add comment');
    }
  }

  // Early return if no article data
  if (!currentArticle) {
    return <div className="container mt-5">Loading article or article not found...</div>;
  }

  // The Article Edit Form Component
  const ArticleEditForm = () => (
    <form onSubmit={handleSubmit(onSave)}>
      <div className="mb-4">
        <label htmlFor="title" className="form-label">Title</label>
        <input type="text" className="form-control" id="title" {...register('title')} />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="form-label">Select a category</label>
        <select {...register('category')} id="category" className="form-select">
          <option value="" disabled>--categories--</option>
          <option value="All">All</option>
          <option value="Technology">Technology</option>
          <option value="Health">Health</option>
          <option value="Business">Business</option>
          <option value="Travel">Travel</option>
          <option value="Education">Education</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="content" className="form-label">Content</label>
        <textarea {...register('content')} className="form-control" id="content" rows="10"></textarea>
      </div>
      <div className="text-end">
        <button type="button" className="btn btn-secondary me-2" onClick={() => setEditArticleStatus(false)}>Cancel</button>
        <button type="submit" className="btn btn-success"><FaSave /> Save</button>
      </div>
    </form>
  );

  // The Comments Component
  const CommentsContainer = () => (
    <div className="container mt-4 bg-white p-4 rounded shadow">
      <div className="comments text-primary">
        <h4 className="mb-3">Comments</h4>
        {!currentArticle.comments || currentArticle.comments.length === 0 ? (
          <p className="fs-5 text-muted">No Comments Yet</p>
        ) : (
          currentArticle.comments.map((commentObj, index) => (
            <div key={commentObj._id || index} className="card mb-3 p-3">
              <div className="d-flex align-items-center mb-2">
                <strong className="me-2">{commentObj?.nameOfUser || "Anonymous"}</strong>
                <small className="text-muted">says:</small>
              </div>
              <p className="mb-0">{commentObj?.comment}</p>
            </div>
          ))
        )}
      </div>

      {commentStatus && <div className="alert alert-success">{commentStatus}</div>}
      
      {currentUser?.role === 'user' && (
        <form onSubmit={handleSubmit(addComment)} className="mt-4">
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">Add a comment:</label>
            <input 
              type="text" 
              id="comment"
              {...register("comment", { required: true })} 
              className="form-control" 
              placeholder="Share your thoughts..."
            />
          </div>
          <button className="btn btn-success">Add Comment</button>
        </form>
      )}
    </div>
  );

  // The Article Content Component
  const ArticleContainer = () => (
    <div className="container bg-white p-4 rounded shadow">
      <div className="container w-100 d-flex">
        <div className="d-flex justify-content-between author-block w-100">
          <div className="mb-4 w-100 rounded-2 justify-content-between align-items-center">
            <p className="display-5 me-4 text-primary">{currentArticle.title}</p>
            <span>
              <small className="text-dark me-4">Created on: {currentArticle.dateOfCreation}</small>
              <small className="text-dark me-4">Modified on: {currentArticle.dateOfModification}</small>
            </span>
          </div>
          <div className="text-center align-items-center mt-4 me-5">
            {currentArticle.authorData?.profileImageUrl && (
              <img src={currentArticle.authorData.profileImageUrl} width="60px" className="rounded-circle" alt="Author" />
            )}
            <p>{currentArticle.authorData?.nameOfAuthor || "Author"}</p>
          </div>
        </div>
        {currentUser?.role === 'author' && currentUser.email === state.authorData.email &&(
          <div className="d-flex me-3 h-100 mt-5">
            <button className="me-2 btn btn-light" onClick={enabledEdit}>
              <FaEdit className="text-warning" />
            </button>
            {currentArticle.isArticleActive ? (
              <button className="me-2 btn btn-light" onClick={deleteArticle}>
                <MdDelete className="text-danger fs-4" />
              </button>
            ) : (
              <button className="me-2 btn btn-light" onClick={restoreArticle}>
                <MdRestore className="text-info fs-4" />
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Blue line before content */}
      <hr className="border border-primary border-2 my-3" />
      
      <p className="lead mt-3 article-content" style={{ whiteSpace: 'pre-line' }}>{currentArticle.content}</p>
    </div>
  );

  return (
    <div className="container text-dark articlesd bg-light py-4">
      {editArticleStatus ? (
        <div className="container bg-white p-4 rounded shadow">
          <ArticleEditForm />
        </div>
      ) : (
        <>
          <ArticleContainer />
          <CommentsContainer />
        </>
      )}
    </div>
  );
}

export default ArticleById;