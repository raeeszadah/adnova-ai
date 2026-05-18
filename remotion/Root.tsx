import React from "react";
import { Composition } from "remotion";
import { AdComposition, type AdCompositionProps } from "./AdComposition";

export const RemotionRoot: React.FC = () => {
  const defaultProps: AdCompositionProps = {
    avatarVideoUrl:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    productImageUrl: "https://placehold.co/600x600/png?text=Product",
    scriptText: "Hook: Amazing product!\n\nBenefits: Works great.\n\nCTA: Buy now!",
  };

  return (
    <>
      <Composition
        id="AdNovaAd"
        component={AdComposition}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
      />
    </>
  );
};
