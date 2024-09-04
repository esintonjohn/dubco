"use client";

import useLinks from "@/lib/swr/use-links";
import { CheckCircleFill } from "@/ui/shared/icons";
import { Button } from "@dub/ui";
import { Globe2 } from "@dub/ui/src/icons";
import { cn } from "@dub/utils";
import { useEffect, useState } from "react";
import { LaterButton } from "../../later-button";
import { useOnboardingProgress } from "../../use-onboarding-progress";

export function DomainSelector() {
  const { continueTo, isLoading, isSuccessful } = useOnboardingProgress();

  return (
    <div>
      <div className="mx-auto w-full max-w-[312px]">
        <DomainOption
          title="Connect a custom domain"
          example="acme.com"
          onClick={() => {}}
          isSelected={true}
        />
      </div>
      <div className="mt-8">
        <Button
          type="button"
          variant="primary"
          onClick={() => continueTo("domain/custom")}
          loading={isLoading || isSuccessful}
          text="Continue"
        />
        <LaterButton next="invite" className="mt-4" />
      </div>
    </div>
  );
}

function DomainOption({
  example,
  onClick,
  isSelected,
}: {
  title: string;
  example: string;
  onClick: () => void;
  isSelected: boolean;
}) {
  const { links } = useLinks({ sort: "createdAt", pageSize: 1 });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (links?.length) {
      try {
        const url = links[0].url;
        fetch(`/api/metatags?url=${url}`).then(async (res) => {
          if (res.ok) {
            const results = await res.json();
            setPreviewImage(results.image);
          }
        });
      } catch (_) {}
    }
  }, [links]);

  return (
    <div
      className={cn(
        "transition-border relative flex flex-col gap-2 rounded-lg border border-gray-300 px-10 py-9",
        isSelected && "border-2 border-black bg-black/[0.03]",
      )}
      role="button"
      onClick={onClick}
      aria-selected={isSelected}
    >
      {isSelected && (
        <CheckCircleFill className="absolute left-2 top-2 size-5 text-black" />
      )}
      <div className="flex w-full flex-col gap-2 rounded-md border border-gray-300 bg-gray-100 p-2 [mask-image:linear-gradient(to_bottom,black_50%,transparent_95%)]">
        <div className="relative rounded border-gray-200 bg-white px-2 py-1.5 text-center text-sm font-medium text-gray-800">
          <Globe2 className="absolute left-2 top-1/2 size-4 -translate-y-1/2" />
          {example}
        </div>
        <div className="overflow-hidden rounded border border-gray-300">
          <div className="aspect-[1.9/1] w-full overflow-hidden bg-gray-200">
            {previewImage && (
              <img
                src={previewImage}
                alt=""
                className="size-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
      <span className="text-center text-sm font-medium text-gray-800">
        Connect a custom domain
      </span>
    </div>
  );
}
