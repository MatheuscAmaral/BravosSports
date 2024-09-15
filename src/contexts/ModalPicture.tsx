import { Button } from "@/components/ui/button";
import { Modal } from "flowbite-react";
import { createContext, ReactNode, useState } from "react";

interface ModalPictureProps {
    openPicture: (modalData: string, image: string) => void;
} 

interface ChildrenProps {
    children: ReactNode
}

export const modalPictureContext = createContext({} as ModalPictureProps);

const ModalPictureProvider = ({ children }: ChildrenProps) => {
    const openPicture = (modalData: string, image: string) => {
        setModalData(modalData);
        setImage(image);
        setOpenModal(true);
    }

    const closeModal = () => {
        setOpenModal(false);
        setImage("");
        setModalData("");
    }

    const [image, setImage] = useState("");
    const [modalData, setModalData] = useState("");
    const [openModal, setOpenModal] = useState(false);

    return (
        <modalPictureContext.Provider value={{ openPicture }}>
            {children}
            <Modal show={openModal} onClose={() => closeModal()}>
                <Modal.Header>{modalData}</Modal.Header>
                <Modal.Body>
                    <img src={image} className=" rounded-sm" alt="foto_aluno" />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="bg-white text-black border border-gray-100 hover:bg-gray-100"
                        onClick={() => closeModal()}
                    >
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </modalPictureContext.Provider>
    )
}

export default ModalPictureProvider;