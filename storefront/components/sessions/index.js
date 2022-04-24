import { useEffect } from "react";
import { useAuth, useSession } from "shared/hooks";
import styles from "./styles.module.css";

// Authorized sessions list
export default function Sessions() {
  const { swellId, userAgent } = useSession();
  const { addCurrentSession, customer } = useAuth();
  const truncate = (str) => str && str.substring(0, 12);
  const sessions = customer.sessions.map((session) => {
    const { swellId: remoteId, userAgent: remoteUA } = session;
    const current = remoteId === swellId && remoteUA === userAgent;
    return { id: remoteId, current, userAgent: remoteUA };
  });

  useEffect(() => {
    addCurrentSession();
  }, []);

  return (
    <>
      <h2>Sessions</h2>
      <p>A maximum of 3 sessions can be logged in at once</p>
      <ul className={styles.list}>
        {sessions.map(({ id, current, userAgent }, index) => (
          <li key={index}>
            <div>
              {current ? "(current)" : ""} {truncate(id)}...
            </div>
            <div>{userAgent}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
