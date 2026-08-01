import HomePage from "@/components/HomePage";

import { getSessionId } from "@/lib/session";
import React from "react";

const LandingPage = async () => {
  const sessionId = await getSessionId();
  return (
    <div>
      <HomePage sessionId={sessionId} />
    </div>
  );
};

export default LandingPage;
