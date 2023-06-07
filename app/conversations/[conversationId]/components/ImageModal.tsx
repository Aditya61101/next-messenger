"use client";
import Modal from '@/app/components/Modals/Modal';
import Image from 'next/image';

type Props = {
    isOpen?: boolean;
    onClose: () => void;
    src?: string | null;
}

const ImageModal = ({ isOpen, onClose, src }: Props) => {
    if (!src) {
        return null;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-80 h-80">
                <Image
                    className="object-cover"
                    fill
                    alt="Image"
                    src={src}
                />
            </div>
        </Modal>
    )
}

export default ImageModal;