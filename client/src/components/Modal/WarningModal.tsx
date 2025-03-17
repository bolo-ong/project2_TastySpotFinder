import styled from "@emotion/styled";
import { Button } from "components";
import { useEscape } from "hooks/useEscape";

export interface Props {
  onClose: () => void;
  onConfirm: () => void;
  warningText?: string;
}

export const WarningModal = ({ onClose, onConfirm, warningText }: Props) => {
  useEscape(onClose);

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={handleContentClick}>
        <ModalBody>
          <p>{warningText || "정말 삭제하시겠습니까?"}</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="outlined" wide onClick={onClose}>
            취소
          </Button>
          <Button variant="warning" wide onClick={onConfirm}>
            삭제
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 1.25rem;
  border-radius: 0.5rem;
  width: 25rem;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ModalBody = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const ModalFooter = styled.div`
  display: flex;
  gap: 0.625rem;
`;
