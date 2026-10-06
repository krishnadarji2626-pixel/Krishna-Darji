import React, { useState, useRef } from 'react';
import { Property, ListingIntent, PropertyType } from '../types/property';
import { X, Upload, CheckCircle2, ShieldCheck, Sparkles, Building2, Phone, Trash2, ImagePlus, Star, Plus } from 'lucide-react';

interface PostPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (newProperty: Property) => void;
}

const SAMPLE_PHOTO_PRESETS = [
  { name: 'Modern Living Lounge', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Luxury Villa Exterior', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Panoramic Sky Balcony', url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Designer Modular Kitchen', url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80' },
  { name: 'High-Rise Tower Facade', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80' },
];

export const PostPropertyModal: React.FC<PostPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
}) => {
  const [intent, setIntent] = useState<ListingIntent>('Buy');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [title, setTitle] = useState('');
  const [locality, setLocality] = useState('Vesu');
  const [subArea, setSubArea] = useState('');
  const [priceNumeric, setPriceNumeric] = useState<number>(9500000);
  const [carpetAreaSqFt, setCarpetAreaSqFt] = useState<number>(1400);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [possessionStatus, setPossessionStatus] = useState<'Ready to Move' | 'Under Construction' | 'Immediate'>('Ready to Move');
  const [furnishingStatus, setFurnishingStatus] = useState<'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished'>('Semi-Furnished');
  const [reraId, setReraId] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerMobile, setSellerMobile] = useState('');
  const [sellerType, setSellerType] = useState<'Owner' | 'Verified Agent' | 'Builder'>('Owner');
  const [requestVerification, setRequestVerification] = useState(true);
  const [requestFeatured, setRequestFeatured] = useState(true);
  const [description, setDescription] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Uploaded images state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(0);
  const [customImageUrlInput, setCustomImageUrlInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local image file upload via FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Validate file is image
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} is not an image.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultUrl = event.target.result as string;
          setUploadedImages((prev) => [...prev, resultUrl]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be re-uploaded if needed
    e.target.value = '';
  };

  const handleAddUrlImage = () => {
    if (!customImageUrlInput.trim()) return;
    setUploadedImages((prev) => [...prev, customImageUrlInput.trim()]);
    setCustomImageUrlInput('');
  };

  const handleAddSamplePreset = (url: string) => {
    if (!uploadedImages.includes(url)) {
      setUploadedImages((prev) => [...prev, url]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (coverImageIndex >= indexToRemove && coverImageIndex > 0) {
      setCoverImageIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !sellerName || !sellerMobile) {
      alert('Please fill in title and your seller contact details.');
      return;
    }

    const priceLakhs = priceNumeric / 100000;
    const priceDisplay = priceLakhs >= 100
      ? `₹${(priceLakhs / 100).toFixed(2)} Cr`
      : `₹${priceLakhs.toFixed(0)} Lakhs`;

    const pricePerSqFt = Math.round(priceNumeric / (carpetAreaSqFt || 1000));

    // Determine cover and gallery images
    const defaultCover = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
    const finalCoverImage = uploadedImages.length > 0
      ? uploadedImages[coverImageIndex] || uploadedImages[0]
      : defaultCover;

    const finalGalleryImages = uploadedImages.length > 0
      ? uploadedImages
      : [
          defaultCover,
          'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
        ];

    const newProp: Property = {
      id: `HV-POSTED-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      locality: locality,
      subArea: subArea.trim() || 'Surat Prime',
      intent: intent,
      propertyType: propertyType,
      priceNumeric: Number(priceNumeric),
      priceDisplay: priceDisplay,
      pricePerSqFt: pricePerSqFt,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      balconies: 2,
      carpetAreaSqFt: Number(carpetAreaSqFt),
      superBuiltupSqFt: Math.round(Number(carpetAreaSqFt) * 1.3),
      furnishingStatus: furnishingStatus,
      possessionStatus: possessionStatus,
      reraId: reraId.trim() || undefined,
      isVerified: requestVerification,
      isFeatured: requestFeatured,
      hasVideoTour: true,
      videoDurationSec: 120,
      coverImage: finalCoverImage,
      galleryImages: finalGalleryImages,
      description: description.trim() || `Prime ${bedrooms} BHK ${propertyType} in ${locality}, Surat. Fully approved title deed, prime connectivity, with ${finalGalleryImages.length} verified photos.`,
      amenities: [
        'Basement Parking',
        'Lift with Backup',
        '24/7 Security CCTV',
        'Clubhouse Access',
        'Municipal Water Connection'
      ],
      nearbyLandmarks: {
        schools: [`Leading School (${locality} Hub)`],
        hospitals: [`Multi-Specialty Care (${locality})`],
        shopping: ['Local High Street Retail'],
        transit: ['BRTS Bus Stop (300m)']
      },
      sellerName: `${sellerName} (${sellerType})`,
      sellerType: sellerType,
      viewsCount: 1
    };

    onAddProperty(newProp);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                HomeVanta Seller Portal
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-xs font-semibold text-stone-600">Surat Direct Listing</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-display">
              Post Your Property in Surat
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto grow">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SECTION 1: PHOTO UPLOAD ZONE */}
              <div className="p-5 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-300 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <ImagePlus className="w-4 h-4 text-amber-600" />
                      <span>Property Images & Photo Gallery</span>
                      {uploadedImages.length > 0 && (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {uploadedImages.length} image{uploadedImages.length > 1 ? 's' : ''} added
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Upload real photos of your property (living room, bedrooms, kitchen, views).
                    </p>
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs whitespace-nowrap"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload from Device</span>
                  </button>
                </div>

                {/* Uploaded Photos Preview Grid */}
                {uploadedImages.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {uploadedImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 bg-stone-100 group transition-all shadow-xs ${
                            coverImageIndex === idx ? 'border-amber-600 ring-2 ring-amber-500/40' : 'border-stone-200'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Uploaded preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />

                          {/* Cover badge */}
                          {coverImageIndex === idx && (
                            <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-amber-600 text-white text-[10px] font-bold rounded shadow-xs flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              <span>Cover Photo</span>
                            </div>
                          )}

                          {/* Action Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                            {coverImageIndex !== idx && (
                              <button
                                type="button"
                                onClick={() => setCoverImageIndex(idx)}
                                className="px-2 py-1 bg-white text-stone-900 text-[10px] font-bold rounded hover:bg-amber-100 transition-colors cursor-pointer"
                                title="Make this image the main listing cover"
                              >
                                Set Cover
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors cursor-pointer"
                              title="Delete this image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add more button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-4/3 rounded-xl border-2 border-dashed border-stone-300 hover:border-amber-500 bg-white hover:bg-amber-50/50 flex flex-col items-center justify-center gap-1 text-stone-500 hover:text-amber-800 transition-colors cursor-pointer"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="text-[11px] font-bold">Add More</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-stone-500">
                      Tip: Hover over any photo to set it as the <strong>Main Cover Photo</strong> or delete it.
                    </p>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="py-6 text-center cursor-pointer hover:bg-stone-100/60 rounded-xl transition-colors space-y-1.5"
                  >
                    <Upload className="w-8 h-8 text-stone-400 mx-auto" />
                    <p className="text-xs font-semibold text-stone-700">
                      Click to browse photos from your phone, laptop, or camera
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Supports JPG, PNG, WEBP (multiple files allowed)
                    </p>
                  </div>
                )}

                {/* Optional: Add via web URL or pick sample presets */}
                <div className="pt-2 border-t border-stone-200/80 space-y-2">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="url"
                      placeholder="Or paste an image web link (https://...)"
                      value={customImageUrlInput}
                      onChange={(e) => setCustomImageUrlInput(e.target.value)}
                      className="w-full sm:flex-1 h-9 px-3 bg-white border border-stone-300 rounded-lg text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrlImage}
                      className="w-full sm:w-auto px-3.5 h-9 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Add Link Photo
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-700">Quick Surat sample photos:</span>
                    {SAMPLE_PHOTO_PRESETS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleAddSamplePreset(p.url)}
                        className="px-2 py-0.5 bg-white hover:bg-stone-100 border border-stone-200 rounded text-[10px] text-stone-700 cursor-pointer"
                      >
                        + {p.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 2: BASIC DETAILS */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                  Property Specifications
                </h4>

                {/* Intent & Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Listing Intent</label>
                    <select
                      value={intent}
                      onChange={(e) => setIntent(e.target.value as any)}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-900 cursor-pointer"
                    >
                      <option value="Buy">For Sale / Resale</option>
                      <option value="Rent">For Rent / Lease</option>
                      <option value="New Project">New Project Launch</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Property Type</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as any)}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-900 cursor-pointer"
                    >
                      <option value="Apartment">Apartment / Flat</option>
                      <option value="Bungalow / Villa">Luxury Bungalow / Villa</option>
                      <option value="Penthouse">Duplex Penthouse</option>
                      <option value="Commercial">Commercial / Showroom</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Property Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3 BHK Luxury Apartment at Vesu main road"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900"
                  />
                </div>

                {/* Locality & Sub-area */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Surat Locality</label>
                    <select
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-900 cursor-pointer"
                    >
                      <option value="Vesu">Vesu</option>
                      <option value="Pal">Pal</option>
                      <option value="Adajan">Adajan</option>
                      <option value="VIP Road">VIP Road</option>
                      <option value="Althan">Althan</option>
                      <option value="Piplod">Piplod</option>
                      <option value="Citylight">Citylight</option>
                      <option value="Katargam">Katargam</option>
                      <option value="Jahangirpura">Jahangirpura</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Sub Area / Landmark</label>
                    <input
                      type="text"
                      placeholder="e.g. Near Shyam Mandir"
                      value={subArea}
                      onChange={(e) => setSubArea(e.target.value)}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900"
                    />
                  </div>
                </div>

                {/* Price & Carpet */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Price (₹ INR)</label>
                    <input
                      type="number"
                      value={priceNumeric}
                      onChange={(e) => setPriceNumeric(Number(e.target.value))}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Carpet (sq.ft)</label>
                    <input
                      type="number"
                      value={carpetAreaSqFt}
                      onChange={(e) => setCarpetAreaSqFt(Number(e.target.value))}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Bedrooms</label>
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 cursor-pointer"
                    >
                      <option value={1}>1 BHK</option>
                      <option value={2}>2 BHK</option>
                      <option value={3}>3 BHK</option>
                      <option value={4}>4 BHK</option>
                      <option value={5}>5+ BHK</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Possession</label>
                    <select
                      value={possessionStatus}
                      onChange={(e) => setPossessionStatus(e.target.value as any)}
                      className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 cursor-pointer"
                    >
                      <option value="Ready to Move">Ready to Move</option>
                      <option value="Under Construction">Under Construction</option>
                      <option value="Immediate">Immediate</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Property Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Highlight features like double-height ceiling, Vastu direction, Italian marble..."
                    className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 resize-none outline-none"
                  />
                </div>

                {/* RERA */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Gujarat RERA Reg No. (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. PR/GJ/SURAT/..."
                    value={reraId}
                    onChange={(e) => setReraId(e.target.value)}
                    className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 font-mono"
                  />
                </div>
              </div>

              {/* SECTION 3: SELLER CONTACT */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <span className="text-xs font-bold text-stone-900 block">Owner / Seller Information</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nilesh Shah"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      className="w-full h-9 px-2.5 bg-white border border-stone-300 rounded text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">Your Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={sellerMobile}
                      onChange={(e) => setSellerMobile(e.target.value)}
                      className="w-full h-9 px-2.5 bg-white border border-stone-300 rounded text-xs tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 block mb-1">You Are</label>
                    <select
                      value={sellerType}
                      onChange={(e) => setSellerType(e.target.value as any)}
                      className="w-full h-9 px-2.5 bg-white border border-stone-300 rounded text-xs cursor-pointer"
                    >
                      <option value="Owner">Direct Owner</option>
                      <option value="Verified Agent">Channel Partner / Agent</option>
                      <option value="Builder">Builder / Developer</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Badges / Checks */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requestVerification}
                    onChange={(e) => setRequestVerification(e.target.checked)}
                    className="accent-amber-600 cursor-pointer"
                  />
                  <span>Request HomeVanta Legal Title Verification Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requestFeatured}
                    onChange={(e) => setRequestFeatured(e.target.checked)}
                    className="accent-amber-600 cursor-pointer"
                  />
                  <span>Promote as Featured Property on Homepage</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 h-12 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>
                    Post Listing {uploadedImages.length > 0 ? `(${uploadedImages.length} Photos Attached)` : ''}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 h-12 border border-stone-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-stone-900 font-display">
                Property Listed Successfully!
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                Your listing with {uploadedImages.length > 0 ? `${uploadedImages.length} uploaded photos` : 'verified photos'} is now live in the HomeVanta Surat listings! Property advisor <strong>Hardik Hingu</strong> has been notified.
              </p>
              <div className="pt-3">
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    onClose();
                  }}
                  className="px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-stone-800 transition-colors"
                >
                  View Active Listings Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
