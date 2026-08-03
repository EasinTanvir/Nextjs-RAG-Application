import React from "react";

import HomePage from "@/components/HomePage";
import { getSessionId } from "@/lib/session";

const LandingPage = async () => {
  const sessionId = await getSessionId();
  return (
    <div>
      <HomePage sessionId={sessionId} />
    </div>
  );
};

export default LandingPage;
