import React, { useEffect, useRef } from "react";
import { Modal } from "./Modal";

interface Props {
  endpoint: string;
  payload: Record<string, string>;
  onClose: () => void;
}

export const PaywayIframe: React.FC<Props> = ({
  endpoint,
  payload,
  onClose
}) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.submit();
  }, [payload]);

  return (
    <Modal onClose={onClose}>
      <iframe
        name="payway_iframe"
        style={{
          width: "100%",
          minHeight: "80vh",
          height: "100%",
          border: "none"
        }}
      />
      <form
        ref={formRef}
        action={endpoint}
        method="POST"
        target="payway_iframe"
      >
        {Object.entries(payload).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
      </form>
    </Modal>
  );
};
