import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "adnova-ai",
});

export type VideoScriptGenerateEvent = {
  name: "video/script.generate";
  data: {
    videoId: string;
    clerkId: string;
    title: string;
    description: string;
    avatarId?: string;
    voiceId?: string;
  };
};

export type VideoPipelineRunEvent = {
  name: "video/pipeline.run";
  data: {
    videoId: string;
    clerkId: string;
  };
};

export type VideoPipelineComposeEvent = {
  name: "video/pipeline.compose";
  data: {
    videoId: string;
    clerkId: string;
  };
};
