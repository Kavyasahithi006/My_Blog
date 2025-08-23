import { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { UserAuthorContextObj } from "../../contexts/UserAuthorContext";
import { useNavigate } from "react-router-dom";

function PostArticle() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { currentUser } = useContext(UserAuthorContextObj);
  const navigate = useNavigate();

  async function postArticle(articleObj) {
    const authorData = {
      nameOfAuthor: currentUser.firstName,
      email: currentUser.email,
      profileImageUrl: currentUser.profileImageUrl,
    };
    articleObj.authorData = authorData;
    articleObj.articleId = Date.now();
    
    let currentDate = new Date();
    let formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()} ${currentDate.toLocaleTimeString("en-US", { hour12: true })}`;
    articleObj.dateOfCreation = formattedDate;
    articleObj.dateOfModification = formattedDate;
    articleObj.comments = [];
    articleObj.isArticleActive = true;

    // Debugging logs
    console.log("Current User Data:", currentUser);
    console.log("Article Data before posting:", articleObj);

    try {
      let res = await axios.post('http://localhost:3000/author-api/article', articleObj);
      console.log("Response from server:", res);

      if (res.status === 201) {
        console.log("Article posted successfully.");
        navigate(`/author-profile/${currentUser.email}/articles`);
      }
    } catch (error) {
      console.error("Error posting article:", error);
    }
  }

  return (
    <div className="container mt-4 p-4 shadow-lg rounded bg-white">
      <h2 className="text-center text-primary fw-bold">Write an Article</h2>
      <form onSubmit={handleSubmit(postArticle)} className="mt-3">
        <div className="mb-3">
          <label className="form-label fw-bold">Title</label>
          <input 
            type="text" 
            className="form-control" 
            {...register("title", { required: "Title is required" })} 
          />
          {errors.title && <p className="text-danger">{errors.title.message}</p>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Select a Category</label>
          <select 
            className="form-select" 
            {...register("category", { required: "Category is required" })}>
            <option value="">-- Select Category --</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Business">Business</option>
          </select>
          {errors.category && <p className="text-danger">{errors.category.message}</p>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Content</label>
          <textarea 
            className="form-control" 
            rows="5" 
            {...register("content", { required: "Content is required" })}>
          </textarea>
          {errors.content && <p className="text-danger">{errors.content.message}</p>}
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-success px-4">Post</button>
        </div>
      </form>
    </div>
  );
}

export default PostArticle;
