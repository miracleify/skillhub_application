import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../loginSection/loginsectionStyles/dashboard.css";
import axios from "axios";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("bestMatches");
  const defaultImageUrl =
    "https://tse1.mm.bing.net/th/id/OIP.yyVZtJgcX_k4j10PaEadSgHaHa?rs=1&pid=ImgDetMain";

  const location = window.location.pathname;
  const pathParts = location.split("/");
  const potentialId = pathParts[pathParts.length - 1];
  const effectiveId = id || potentialId;

  const handleViewProfile = (e, otherUser) => {
    e.preventDefault(); // Prevent default link behavior
    sessionStorage.setItem("selectedTradesPerson", JSON.stringify());
    navigate(`/profile/${otherUser?.id || otherUser?._id}`); // Handle both id formats
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!effectiveId || effectiveId === "undefined") {
      setError("No user ID provided");
      setLoading(false);
      return;
    }

    axios
      .get("https://skillhub-api-y3gi.onrender.com/api/users/")
      .then((response) => {
        if (!response.data || response.data.length === 0) {
          setError("No users found in system");
          setLoading(false);
          return;
        }

        setAllUsers(response.data);

        let foundUser = response.data.find(
          (u) =>
            u.id === parseInt(effectiveId) ||
            String(u.id) === String(effectiveId) ||
            String(u._id) === String(effectiveId)
        );

        if (!foundUser) {
          const storedUser = sessionStorage.getItem("selectedTradesPerson");

          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);

              foundUser = {
                id: parsedUser.id,
                _id: parsedUser.id,
                full_name: `${parsedUser.fname} ${parsedUser.lname}`.trim(),
                photoURL: parsedUser.image,
                areas_of_expertise: parsedUser.expertise,
                address: parsedUser.location,
                ratings: parsedUser.ratings,
                verified: parsedUser.verified,
                bio: parsedUser.bio || "",
              };
            } catch (e) {
              console.error("Error parsing stored user:", e);
            }
          }
        }

        if (foundUser) {
          setUser(foundUser);

          const formattedUser = {
            id: foundUser.id || foundUser._id,
            fname: foundUser.full_name ? foundUser.full_name.split(" ")[0] : "",
            lname: foundUser.full_name
              ? foundUser.full_name.split(" ").slice(1).join(" ")
              : "",
            image: foundUser.photoURL || defaultImageUrl,
            expertise: foundUser.areas_of_expertise || "Not specified",
            location: foundUser.address || "Not specified",
            ratings: foundUser.ratings || "No ratings yet",
            verified: foundUser.verified || false,
            bio: foundUser.bio || "",
          };

          sessionStorage.setItem(
            "selectedTradesPerson",
            JSON.stringify(formattedUser)
          );

          applyFilter("bestMatches", response.data, foundUser);
        } else {
          const mockUser = {
            id: "mock-id",
            _id: "mock-id",
            full_name: "Guest User",
            photoURL: defaultImageUrl,
            areas_of_expertise: "Construction",
          };
          setUser(mockUser);
          setFilteredUsers(response.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError(`Failed to load users: ${error.message}`);
        setLoading(false);
      });
  }, [effectiveId]);

  const applyFilter = (filterType, users = allUsers, currentUser = user) => {
    setActiveFilter(filterType);

    if (!users || users.length === 0) {
      setFilteredUsers([]);
      return;
    }

    let otherUsers = users;

    if (currentUser) {
      otherUsers = users.filter((u) => {
        if (!u) return false;
        const userId = u.id || u._id;
        const currentUserId = currentUser.id || currentUser._id;
        if (userId && currentUserId) {
          return String(userId) !== String(currentUserId);
        }
        return true;
      });
    }

    let filtered = [];

    if (filterType === "bestMatches") {
      filtered = [...otherUsers];
      filtered.sort((a, b) => {
        const aSkills = String(a.areas_of_expertise || "");
        const bSkills = String(b.areas_of_expertise || "");
        const userSkills = String(currentUser?.areas_of_expertise || "");
        const aMatch = countMatchingSkills(aSkills, userSkills);
        const bMatch = countMatchingSkills(bSkills, userSkills);
        return bMatch - aMatch;
      });
    } else if (filterType === "mostRecent") {
      filtered = [...otherUsers];
      filtered.sort((a, b) => {
        const aId = parseInt(a.id || a._id || 0);
        const bId = parseInt(b.id || b._id || 0);
        return bId - aId;
      });
    } else if (filterType === "savedJobs") {
      filtered = [...otherUsers];
    }

    setFilteredUsers(filtered);
  };

  const countMatchingSkills = (skills1, skills2) => {
    if (!skills1 || !skills2) return 0;
    const words1 = skills1.toLowerCase().split(/\s+/);
    const words2 = skills2.toLowerCase().split(/\s+/);
    let matches = 0;
    words1.forEach((word) => {
      if (words2.includes(word) && word.length > 2) {
        matches++;
      }
    });
    return matches;
  };

  const handleFilterClick = (filterType) => {
    applyFilter(filterType);
  };

  const handleSelectChange = (e) => {
    const selectedOption = e.target.value;
    if (selectedOption === "log out") {
      navigate("/signin");
    } else if (selectedOption === "profile") {
      console.log("Navigate to profile");
    } else if (selectedOption === "setting") {
      console.log("Navigate to settings");
    }
  };

  if (loading) {
    return <div className="dashboard-body">Loading user data...</div>;
  }

  if (error) {
    return <div className="dashboard-body">Error: {error}</div>;
  }

  return (
    <div className="dashboard-body">
      <div className={`nav-container ${scrolled ? "scrolled" : ""}`}>
        <div className="navbars">
          <div className="nav-logo">
            <Link to="/">
              <img src="/image.png" alt="Logo" />
            </Link>
          </div>

          <div className="profile-icons">
            <ul>
              <li>
                <i className="fa-solid fa-message"></i>
              </li>
              <li>
                <i className="fa-solid fa-bell"></i>
              </li>
              <li>
                <i className="fa-regular fa-user"></i>
              </li>
              <li>
                <select onChange={handleSelectChange} defaultValue="">
                  <option value="" disabled hidden></option>
                  <option className="profile" value="profile">
                    My Profile
                  </option>
                  <option value="setting">Settings</option>
                  <option className="logout" value="log out">
                    Log Out
                  </option>
                </select>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div className="dash">
              <h3>My Dashboard</h3>
            </div>
            <div className="image-container">
              <img
                className="photo"
                src={user.photoURL || defaultImageUrl}
                alt="Avatar"
              />
            </div>
          </div>
        </div>
      </div>
      <br></br> <br></br>
      <div className="dashboard-rectangles">
        <div className="rect">
          <h3 className="rect-text">Total Earnings</h3>
          <span style={{ marginLeft: "-30px" }} className="points">
            8000
          </span>
        </div>
        <div className="rect">
          <h3 className="rect-text">Total Leads</h3>
          <span className="points">50</span>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <div className="jobs-and-btn">
        <h3>Jobs you might like !</h3>
        <div className="jobs-butons">
          <button
            className={`job-btn ${
              activeFilter === "bestMatches" ? "active" : ""
            }`}
            onClick={() => handleFilterClick("bestMatches")}
          >
            Best Matches
          </button>
          <button
            className={`job-btn ${
              activeFilter === "mostRecent" ? "active" : ""
            }`}
            onClick={() => handleFilterClick("mostRecent")}
          >
            Most Recent
          </button>
          <button
            className={`job-btn ${
              activeFilter === "savedJobs" ? "active" : ""
            }`}
            onClick={() => handleFilterClick("savedJobs")}
          >
            Saved Jobs
          </button>
        </div>
      </div>
      <div className="varitiesOfjob-container">
        {loading ? (
          <div>Loading user data...</div>
        ) : (
          <div className="jobprofile-card">
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map((otherUser, index) => (
                <div
                  key={otherUser?.id || otherUser?._id || index}
                  className="jobcard"
                >
                  <div className="user-profile">
                    <div className="container">
                      <div className="user-info">
                     <div className="aligned">
                     <p className="skill">
                          {(`Seeking Skilled ${otherUser?.areas_of_expertise ||
                            "No skills specified"}`)}
                        </p>
                        <br></br>
                        <h4 className="name-text" >
                          {" "}
                          <a
                          className="underline-text"
                            href={`/profile/${otherUser?.id || otherUser?._id}`}
                            onClick={(e) => handleViewProfile(e, otherUser)}
                          >
                            {otherUser?.full_name || "Unknown Name"}
                          </a>{" "}
                        </h4>
                     </div>
                       
                      </div>
                      <img
                        className="dashboard-photourl"
                        src={otherUser?.photoURL || defaultImageUrl}
                        alt={otherUser?.full_name || "Artisan"}
                      />
                      {otherUser?.verified && (
                      <span className="verified-badge">
                          <i className="fa-solid fa-circle-check verification-icon"></i>
                        </span>
                      )}
                      <p className="bio">
                        {otherUser?.bio || "No bio available"}
                      </p>
                    </div>
                  </div>
                  <br></br>
                  <br></br>
                </div>
              ))
            ) : (
              <div className="no-users">
                <p>No users found matching the selected filter</p>
                <p>Total users in database: {allUsers?.length || 0}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
