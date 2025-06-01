"use client";
import styles from "./DropdownMenu.module.scss";
import { useStore } from "@/app/store/store";

type DropdownMenuProps = {
  itemId: string;
  type: "post" | "comment" | "reply";
  isOwner?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onOptionClick?: (option: string) => void;
};

const DropdownMenu = ({
  itemId,
  type,
  isOwner,
  onDelete,
  onEdit,
  onOptionClick,
}: DropdownMenuProps) => {
  const { openDropdownId, openDropdown, closeDropdown } = useStore();
  const isOpen = openDropdownId === itemId;

  const handleOptionClick = (option: string) => {
    onOptionClick?.(option);
    closeDropdown();
  };

  const handleDelete = () => {
    onDelete?.();
    closeDropdown();
  };

  const handleEdit = () => {
    onEdit?.();
    closeDropdown();
  };

  const menuItems = [
    { label: "Save", action: "Save" },
    { label: "Not interested", action: "Not interested" },
    { label: "Mute", action: "Mute" },
    { label: "Block", action: "Block" },
    { label: "Report", action: "Report" },
    { label: "Copy link", action: "Copy link" },
  ];

  const availableMenuItems =
    type === "reply"
      ? menuItems.filter(
          (item) => !["Save", "Not interested"].includes(item.action)
        )
      : menuItems;

  return (
    <div className={styles.menuContainer}>
      <button
        className={styles.menuButton}
        onClick={() => (isOpen ? closeDropdown() : openDropdown(itemId))}
        aria-label={`Open menu for ${type}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#888"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="12" cy="6" r="1"></circle>
          <circle cx="12" cy="18" r="1"></circle>
        </svg>
      </button>
      {isOpen && (
        <div className={styles.menuDropdown}>
          {availableMenuItems.map((item) => (
            <button
              key={item.action}
              onClick={() => handleOptionClick(item.action)}
              className={styles.menuItem}
            >
              {item.action === "Save" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#888"
                  strokeWidth="2"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
              )}
              {item.action === "Not interested" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24"
                  fill="none"
                  stroke="#888"
                  strokeWidth="2"
                >
                  <path d="M10 15l5-5"></path>
                  <path d="M16 15l-5-5"></path>
                </svg>
              )}
              {item.action === "Mute" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#888"
                  strokeWidth="2"
                >
                  <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
                  <path d="M15 9l-3 3m0-3l3 3"></path>
                </svg>
              )}
              {item.action === "Block" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#888"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                </svg>
              )}
              {item.action === "Report" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#888"
                  strokeWidth="2"
                >
                  <path d="M12 8v4"></path>
                  <path d="M12 16h.01"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              )}
              {item.action === "Copy link" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#888"
                  strokeWidth="2"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              )}
              {item.label}
            </button>
          ))}
          {isOwner && (
            <>
              <button onClick={handleEdit} className={styles.menuItem}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#888"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </button>
              <button
                onClick={handleDelete}
                className={`${styles.menuItem} ${styles.delete}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ff4757"
                  strokeWidth="2"
                >
                  <path d="M3 6h18"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <path d="M3 6v14c0 1 1 2 2 2h14c1 0 2-1 2-2V6"></path>
                  <path d="M10 11v6"></path>
                  <path d="M14 11v6"></path>
                </svg>
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
