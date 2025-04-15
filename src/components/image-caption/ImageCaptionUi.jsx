import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosCaller } from "../../axios/AxiosCaller";
import { callMethods } from "../../constants/CommonConstants";
import NoData from "../../404 Page/NoData";

const ImageCaptionUi = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchImages = async (query) => {
    if (!query.trim()) {
      setError("Please enter a valid search term.");
      setImages([]);
      return;
    }
    setIsLoading(true);

    try {
      const payload = {
        query: query.trim(),
        per_page: 20,
      };

      const response = await axiosCaller(callMethods.get, payload);

      if (response?.data?.photos?.length > 0) {
        setImages(response.data.photos);
        setIsLoading(false);
        setError("");
      } else {
        setImages([]);
        setIsLoading(false);
        setError("No results found for your search.");
      }
    } catch (error) {
      console.error("Error fetching images from Pexels:", error);
      setImages([]);
      setError("An error occurred while fetching images. Please try again.");
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      fetchImages(debouncedSearch);
    }
  }, [debouncedSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchImages(searchTerm);
  };

  const handleAddCaption = (imageUrl) => {
    navigate("/add-caption", { state: { imageUrl } });
  };

  const handleClearInput = () => {
    setSearchTerm("");
    setImages([]);
    setError("");
  };

  return (
    <div className="container">
      <div className="user-info">
        <p>
          <strong>Name:</strong> Shubham Singh
        </p>
        <p>
          <strong>Email:</strong> 0shubhamit@gmail.com
        </p>
      </div>

      <div className="caption-main">Image Caption UI</div>

      <form
        onSubmit={handleSearch}
        className="search-form"
        style={{ position: "relative" }}
      >
        <input
          type="text"
          placeholder="Search Images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ paddingRight: "30px" }}
        />
        {searchTerm.length >= 2 && (
          <span
            onClick={handleClearInput}
            style={{
              position: "absolute",
              right: "44.5%",
              top: "65%",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#999",
              fontSize: "16px",
            }}
            title="Clear"
          >
            ✖
          </span>
        )}
        <button type="submit">Search</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {images?.length > 0 ? (
        <div className="image-grid">
          {images.map((data, index) => (
            <div key={data?.id} className="image-card">
              <img src={data?.src?.medium} alt={`img-${index}`} />
              <button onClick={() => handleAddCaption(data?.src?.medium)}>
                Add Caption
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <NoData isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default ImageCaptionUi;
