import styles from './CenterInViewport.module.scss';

export type CenterInViewportProps = {
  children: React.ReactNode;
  /** Optional title rendered above the content (e.g. app name). */
  title?: React.ReactNode;
  /** Max width of the content area (default 24rem). null/undefined = no max width. */
  contentMaxWidth?: string | null;
};

/**
 * Fills the available viewport and centers its children vertically and horizontally
 * when they fit. Use for auth pages, splash content, etc. Scrolls when content overflows.
 */
export function CenterInViewport({ children, title, contentMaxWidth }: CenterInViewportProps) {
  return (
    <div className={styles.root}>
      <div className={styles.center}>
        {title !== undefined && <h1 className={styles.title}>{title}</h1>}
        <div
          className={styles.content}
          style={contentMaxWidth ? { maxWidth: contentMaxWidth } : {}}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
