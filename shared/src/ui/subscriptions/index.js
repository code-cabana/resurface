import { Button } from "../button";
import { useSwellSub } from "../../hooks";

function Subscription({ debug }) {
  const { subscription, pause, unpause, cancel } = useSwellSub();
  const { active, status, paused, canceled } = subscription || {};

  return (
    <>
      {debug && <pre>{JSON.stringify(subscription, null, 2)}</pre>}
      <div>
        <div>Active: {active ? "yes" : "no"}</div>
        <div>Status: {status}</div>
        {!canceled && (
          <>
            {paused ? (
              <Button onClick={unpause}>Resume</Button>
            ) : (
              <Button onClick={pause}>Pause</Button>
            )}
            <Button onClick={cancel}>Cancel</Button>
          </>
        )}
      </div>
    </>
  );
}

export function Subscriptions() {
  return <Subscription debug={true} />;
}
