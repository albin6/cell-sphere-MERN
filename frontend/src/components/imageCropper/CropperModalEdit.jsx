import React, { useRef, useState, useCallback } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { X } from "lucide-react";
import { Button } from "../ui/ui-components";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

const CropperModal = ({ updateAvatar, closeModal, imageSrc }) => {
  console.log(imageSrc);
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [error, setError] = useState("");

  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  }, []);

  const handleCropImage = () => {
    if (imgRef.current && completedCrop) {
      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const pixelCrop = convertToPixelCrop(
        completedCrop,
        image.width,
        image.height
      );

      const canvas = document.createElement("canvas");
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedImageUrl = URL.createObjectURL(blob);
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;
            updateAvatar(base64data, croppedImageUrl);
            closeModal();
          };
        }
      }, "image/jpeg");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[95%] max-w-2xl bg-white rounded-lg shadow-xl">
        <div className="p-6">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={closeModal}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <h2 className="text-2xl font-bold mb-4">Crop Image</h2>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <div className="flex flex-col items-center">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={ASPECT_RATIO}
              minWidth={MIN_DIMENSION}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop"
                style={{ maxHeight: "60vh", maxWidth: "100%" }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
            <Button
              className="mt-4"
              onClick={handleCropImage}
              disabled={!completedCrop}
            >
              Crop Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropperModal;
