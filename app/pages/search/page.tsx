"use client";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import styles from "./SearchPage.module.scss";
import { UserType } from "../../types";
import { useStore } from "@/app/store/store";

type SearchPageProps = {
  user: UserType | null;
};

const SearchPage = ({ user }: SearchPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { followUser, unfollowUser, isFollowing } = useStore();
  const [suggestions] = useState([
    {
      id: 1,
      name: "blackspectrumscholar",
      followers: "12.6K",
    },
    {
      id: 2,
      name: "Kaligirwa",
      occupation: "Communications Researcher",
    },
    {
      id: 3,
      name: "AbirIslami",
      bio: "Here to inspire your inner chef",
      followers: "1.6M",
    },
    {
      id: 4,
      name: "Bintang77",
      bio: "Like Travel, Science and Art",
      followers: "7.4K",
    },
  ]);

  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFollowClick = (userName: string) => {
    if (isFollowing(userName)) {
      unfollowUser(userName);
    } else {
      followUser(userName);
    }
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar user={user} />
      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.searchHeader}>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <div className={styles.suggestions}>
            <h3 className={styles.suggestionsTitle}>Follow suggestions</h3>
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((suggestion) => (
                <div key={suggestion.id} className={styles.suggestionItem}>
                  <div className={styles.userInfo}>
                    <div className={styles.userName}>{suggestion.name}</div>
                    {suggestion.occupation && (
                      <div className={styles.userOccupation}>
                        {suggestion.occupation}
                      </div>
                    )}
                    {suggestion.followers && (
                      <div className={styles.userFollowers}>
                        {suggestion.followers} followers
                      </div>
                    )}
                    {suggestion.bio && (
                      <div className={styles.userBio}>{suggestion.bio}</div>
                    )}
                  </div>
                  <button
                    className={`${styles.followButton} ${
                      isFollowing(suggestion.name) ? styles.following : ""
                    }`}
                    onClick={() => handleFollowClick(suggestion.name)}
                  >
                    {isFollowing(suggestion.name) ? "Following" : "Follow"}
                  </button>
                </div>
              ))
            ) : (
              <div className={styles.noResults}>No results found</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
