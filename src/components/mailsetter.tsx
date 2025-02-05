import { useEffect, useState } from "react";

interface mailSetterProps {
  data: {
    to: string[] | null;
    bcc: string[] | null;
    cc: string[] | null;
    subject: string | null;
    description: string | null;
  } ;
}

export default function MailSetter({ data }: mailSetterProps) {
  useEffect(() => {
    populateComposeBox(data);
  }, [data]);

  const populateComposeBox = (mailData: typeof data) => {
    const setInputValue = (selector: string, value: string) => {
      const inputElement = document.querySelector(selector) as
        | HTMLInputElement
        | HTMLTextAreaElement;
      if (inputElement) {
        inputElement.value = value;
        const event = new Event("input", { bubbles: true });
        inputElement.dispatchEvent(event);
      }
    };

    if (mailData.to && mailData.to.length > 0) {
      setInputValue('input[aria-label="To"]', mailData.to.join(", "));
    }

    if (mailData.cc && mailData.cc.length > 0) {
      const ccButton = document.querySelector(
        'div[aria-label="Add Cc"]'
      ) as HTMLElement;
      if (ccButton) {
        ccButton.click();
      }
      setInputValue('input[aria-label="Cc"]', mailData.cc.join(", "));
    }

    if (mailData.bcc && mailData.bcc.length > 0) {
      const bccButton = document.querySelector(
        'div[aria-label="Add Bcc"]'
      ) as HTMLElement;
      if (bccButton) {
        bccButton.click();
      }
      setInputValue('input[aria-label="Bcc"]', mailData.bcc.join(", "));
    }

    if (mailData.subject) {
      setInputValue('input[name="subjectbox"]', mailData.subject);
    }

    if (mailData.description) {
      const bodyElement = document.querySelector(
        'div[aria-label="Message Body"]'
      ) as HTMLDivElement;
      if (bodyElement) {
        bodyElement.innerText = mailData.description;
        const event = new Event("input", { bubbles: true });
        bodyElement.dispatchEvent(event);
      }
    }
  };

  return null;
}
