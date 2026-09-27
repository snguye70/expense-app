import photo from './assets/receipt-luna-ramen.jpg'
import './ReceiptPhoto.css'

// The sample receipt photo (generated in Paper) is 1024 × 1024.
// Boxes are in photo pixels: where the receipt, and its tip line, sit in the shot.
const PHOTO_SIZE = 1024
export const RECEIPT_BOX = { x: 210, y: 148, w: 598, h: 820 }
export const TIP_BOX = { x: 250, y: 622, w: 510, h: 76 }

const pct = (n) => `${(n / PHOTO_SIZE) * 100}%`

// A cropped piece of the photo, drawn at the given width.
export function PhotoCrop({ box, width, label, className = '' }) {
  const scale = width / box.w
  return (
    <span
      role="img"
      aria-label={label}
      className={`photo-crop ${className}`}
      style={{
        width,
        height: Math.round(box.h * scale),
        backgroundImage: `url(${photo})`,
        backgroundSize: `${PHOTO_SIZE * scale}px`,
        backgroundPosition: `${-box.x * scale}px ${-box.y * scale}px`,
      }}
    />
  )
}

// The whole photo filling the camera viewfinder, with corner brackets around the receipt once found.
export function CameraView({ found }) {
  return (
    <div className="camera-photo">
      <img src={photo} alt="Receipt from Luna Ramen on a table" />
      {found && (
        <span
          className="detection-frame"
          aria-hidden="true"
          style={{ left: pct(RECEIPT_BOX.x), top: pct(RECEIPT_BOX.y), width: pct(RECEIPT_BOX.w), height: pct(RECEIPT_BOX.h) }}
        >
          <span className="corner corner--tl" />
          <span className="corner corner--tr" />
          <span className="corner corner--bl" />
          <span className="corner corner--br" />
        </span>
      )}
    </div>
  )
}
