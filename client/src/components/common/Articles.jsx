import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

function Articles() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [error, setError] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();
  const { getToken } = useAuth();

  async function getArticles() {
    try {
      const token = await getToken();
      let res = await axios.get("http://localhost:3000/author-api/articles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.message === "articles") {
        setArticles(res.data.payload);
        setFilteredArticles(res.data.payload);
        setError("");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      setError("Failed to fetch articles.");
    }
  }

  useEffect(() => {
    getArticles();
  }, [getToken]);

  useEffect(() => {
    let filtered = articles.filter((article) => {
      return (
        (authorFilter === "" || article.authorData.nameOfAuthor.toLowerCase().includes(authorFilter.toLowerCase())) &&
        (categoryFilter === "" || article.category === categoryFilter)
      );
    });
    setFilteredArticles(filtered);
  }, [authorFilter, categoryFilter, articles]);

  function gotoArticleById(articleObj) {
    navigate(`../articleId/${articleObj._id}`, { state: articleObj });
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4 fw-bold">📰 Latest Articles</h2>

      {/* Display Error Message */}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control shadow-sm"
            placeholder="🔍 Filter by Author Name"
            value={authorFilter}
            onChange={(e) => setAuthorFilter(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select shadow-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">📌 All Categories</option>
            <option value="Technology">💻 Technology</option>
            <option value="Health">🏥 Health</option>
            <option value="Education">📚 Education</option>
            <option value="Business">💼 Business</option>
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        {filteredArticles.map((articleObj) => (
          <div className="col" key={articleObj.articleId}>
            <div className="card shadow-lg h-100 border-0">
              <div className="card-body d-flex flex-column">
                {/* Author Info */}
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={articleObj.authorData.profileImageUrl}
                    width="45"
                    height="45"
                    className="rounded-circle me-2 border border-primary"
                    alt="Author"
                  />
                  <p className="m-0 text-secondary small fw-semibold">
                    {articleObj.authorData.nameOfAuthor}
                  </p>
                </div>

                {/* Article Title */}
                <h5 className="card-title fw-bold text-dark">{articleObj.title}</h5>

                {/* Article Content Preview */}
                <p className="card-text text-muted flex-grow-1">
                  {articleObj.content.substring(0, 80) + "...."}
                </p>

                {/* Read More Button */}
                <button
                  className="btn btn-primary w-100 mt-auto fw-semibold shadow-sm"
                  onClick={() => gotoArticleById(articleObj)}
                >
                  📖 Read More
                </button>
              </div>

              {/* Card Footer */}
              <div className="card-footer bg-light border-0 text-muted small text-end">
                <i className="bi bi-clock-history"></i> Last updated on {articleObj.dateOfModification}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Articles Message */}
      {filteredArticles.length === 0 && !error && (
        <div className="text-center mt-4">
          <p className="text-muted fs-5">😔 No articles found. Try adjusting the filters.</p>
        </div>
      )}
    </div>
  );
}

export default Articles;
