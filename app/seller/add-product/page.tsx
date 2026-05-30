"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Shield, Clock, MapPin, Eye } from "lucide-react";
import SellerNavbar from "../../../components/seller/SellerNavbar";

export default function AddProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const getLocalDateTimeString = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - offset).toISOString();
    return localISOTime.slice(0, 16);
  };
  const [formData, setFormData] = useState({
    name: "",
    category: "Chuột gaming",
    customCategory: "",
    condition: "Mới 99% — Fullbox",
    description: "",
    startPrice: "800000",
    minIncrement: "50000",
    buyNowPrice: "1800000",
    duration: "5 ngày",
    startDate: getLocalDateTimeString(),
    resetTime: "12",
    hasWarranty: true,
    warrantyStartDate: "2026-04-19",
    city: "TP. Hồ Chí Minh",
    district: "Quận 5",
    specificAddress: "123 Nguyễn Trãi, Phường 2",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const processFiles = (files: FileList) => {
    const filesArray = Array.from(files).filter(file => file.type.startsWith("image/"));
    if (imageFiles.length + filesArray.length > 8) {
      alert("Tối đa 8 ảnh!");
      return;
    }
    setImageFiles((prev) => [...prev, ...filesArray]);
    const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newImageUrls]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (idx: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authHeader = 'Basic ' + btoa('user:315686f2-4834-40c8-905f-5380ac9f5991');

      const productPayload = new FormData();
      const productData = {
        categoryId: 1, 
        title: formData.name,
        description: `${formData.condition}\n${formData.description}`,
        sellerId: 1, 
        price: Number(formData.buyNowPrice) || Number(formData.startPrice),
        status: "ACTIVE"
      };

      productPayload.append("data", new Blob([JSON.stringify(productData)], { type: "application/json" }));
      imageFiles.forEach(file => {
        productPayload.append("images", file);
      });

      const productRes = await fetch("http://localhost:8080/products", {
        method: "POST",
        headers: {
          'Authorization': authHeader
        },
        body: productPayload
      });

      if (!productRes.ok) throw new Error("Lỗi khi tạo sản phẩm");
      const productJson = await productRes.json();
      const newProductId = productJson.data.id;

      const startDateTime = new Date(formData.startDate);
      const daysToAdd = parseInt(formData.duration.split(" ")[0]);
      const endDateTime = new Date(startDateTime);
      endDateTime.setDate(endDateTime.getDate() + daysToAdd);

      const auctionData = {
        productId: newProductId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        startingPrice: Number(formData.startPrice),
        minimumStep: Number(formData.minIncrement),
        enableExtentTime: true,
        threshhold: Number(formData.resetTime)
      };

      const auctionRes = await fetch("http://localhost:8080/auctions", {
        method: "POST",
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(auctionData)
      });

      if (!auctionRes.ok) throw new Error("Lỗi khi tạo phiên đấu giá");

      alert("Đăng sản phẩm thành công!");
      router.push("/seller");

    } catch (error) {
      console.error("Submit Error:", error);
      alert("Đã xảy ra lỗi khi đăng sản phẩm. Vui lòng kiểm tra console log.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e0e3ea] flex flex-col pb-16 text-base relative">
      <SellerNavbar
        pageTitle="Thêm sản phẩm"
        pageSubtitle="Tạo phiên đấu giá mới"
        onBack={() => router.push("/seller")}
        userName="K"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-8 relative">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-[#14161d] p-8 rounded-xl border border-white/5 space-y-5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5 border-b border-white/5 pb-4">
                <span className="w-2 h-5 bg-orange-500 rounded-full"></span>
                Thông tin sản phẩm
              </h2>

              <div>
                <label className="block text-sm text-gray-400 mb-2.5 font-medium">Tên sản phẩm *</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="VD: Razer DeathAdder V3 HyperSpeed Wireless"
                  className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-4 text-base text-white focus:border-orange-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-2.5 font-medium">Danh mục *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-4 text-base text-white focus:border-orange-500 outline-none transition cursor-pointer"
                  >
                    <option value="Chuột gaming">Chuột gaming</option>
                    <option value="Bàn phím cơ">Bàn phím cơ</option>
                    <option value="Tai nghe">Tai nghe</option>
                    <option value="Màn hình">Màn hình</option>
                    <option value="Khác">Khác (Tự nhập)</option>
                  </select>

                  {formData.category === "Khác" && (
                    <input
                      required
                      type="text"
                      name="customCategory"
                      value={formData.customCategory}
                      onChange={handleInputChange}
                      placeholder="Nhập danh mục mới của bạn..."
                      className="w-full bg-[#0f1117] border border-orange-500/50 rounded-lg p-4 text-base text-white mt-3 outline-none transition"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2.5 font-medium">Tình trạng *</label>
                  <input
                    required
                    type="text"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    placeholder="Mới 99% — Fullbox"
                    className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-4 text-base text-white focus:border-orange-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2.5 font-medium">Mô tả sản phẩm</label>
                <textarea
                  rows={5}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả chi tiết tình trạng, thông số kỹ thuật..."
                  className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-4 text-base text-white focus:border-orange-500 outline-none transition resize-none"
                />
              </div>
            </div>

            <div className="bg-[#14161d] p-8 rounded-xl border border-white/5 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5 border-b border-white/5 pb-4">
                <span className="w-2 h-5 bg-orange-500 rounded-full"></span>
                Cài đặt đấu giá
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-2.5 font-medium">Giá khởi điểm *</label>
                  <div className="relative">
                    <input required type="number" name="startPrice" value={formData.startPrice} onChange={handleInputChange} className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-4 pr-14 text-base text-white focus:border-orange-500 outline-none" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">VNĐ</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2.5 font-medium">Mức tăng tối thiểu</label>
                  <div className="relative">
                    <input type="number" name="minIncrement" value={formData.minIncrement} onChange={handleInputChange} className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-4 pr-14 text-base text-white focus:border-orange-500 outline-none" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">VNĐ</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2.5 font-medium">Giá mua ngay (tùy chọn)</label>
                  <div className="relative">
                    <input type="number" name="buyNowPrice" value={formData.buyNowPrice} onChange={handleInputChange} className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-4 pr-14 text-base text-white focus:border-orange-500 outline-none" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">VNĐ</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-3 font-medium">Thời gian đấu giá *</label>
                <div className="flex flex-wrap gap-3">
                  {["1 ngày", "3 ngày", "5 ngày", "7 ngày", "10 ngày"].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setFormData(p => ({ ...p, duration: d }))}
                      className={`px-5 py-3 text-sm font-semibold rounded-lg border transition cursor-pointer ${
                        formData.duration === d 
                          ? "bg-orange-500/10 border-orange-500 text-orange-400" 
                          : "bg-[#0f1117] border-white/10 text-gray-400 hover:text-white"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-2.5 font-medium">Ngày bắt đầu *</label>
                  <input 
                    type="datetime-local" 
                    name="startDate" 
                    value={formData.startDate} 
                    onChange={handleInputChange} 
                    className="w-full bg-[#0f1117] border-2 border-orange-500/60 hover:border-orange-500 rounded-lg p-4 text-base text-white outline-none cursor-pointer transition [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100" 
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2.5 font-medium flex items-center gap-1.5">
                    Thời gian reset *
                    <span className="text-xs text-gray-500 font-normal">(Cơ chế reset đồng hồ)</span>
                  </label>
                  <div className="relative">
                    <input type="number" name="resetTime" value={formData.resetTime} onChange={handleInputChange} className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-4 pr-14 text-base text-white focus:border-orange-500 outline-none" />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">giờ</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed bg-[#0f1117] p-4 rounded-lg border border-white/5">
                <strong>Cơ chế reset đồng hồ:</strong> Nếu có người đặt giá cao hơn trong khoảng thời gian này, đồng hồ sẽ tự động cộng thêm ngưỡng đã cài đặt để đảm bảo công bằng.
              </p>
            </div>

            <div className="bg-[#14161d] p-8 rounded-xl border border-white/5 space-y-5">
              <div className="flex items-start gap-4 bg-[#0f1117] p-5 rounded-xl border border-white/5">
                <input type="checkbox" name="hasWarranty" id="hasWarranty" checked={formData.hasWarranty} onChange={handleInputChange} className="mt-1.5 accent-orange-500 h-5 w-5 cursor-pointer" />
                <div className="flex-1">
                  <label htmlFor="hasWarranty" className="text-base font-bold text-white flex items-center gap-2 cursor-pointer select-none">
                    <Shield size={18} className="text-orange-400" /> Còn bảo hành
                  </label>
                  <p className="text-sm text-gray-400 mt-1">Nếu sản phẩm vẫn còn trong thời hạn bảo hành của nhà sản xuất hoặc nhà bán lẻ.</p>
                  
                  {formData.hasWarranty && (
                    <div className="mt-4 max-w-xs">
                      <label className="block text-xs text-gray-400 mb-2 font-medium">Thời gian bắt đầu bảo hành</label>
                      <input 
                        type="date" 
                        name="warrantyStartDate" 
                        value={formData.warrantyStartDate} 
                        onChange={handleInputChange} 
                        className="w-full bg-[#14161d] border-2 border-orange-500/60 hover:border-orange-500 rounded-lg p-3 text-sm text-white outline-none cursor-pointer transition [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100" 
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#0f1117] p-5 rounded-xl border border-white/5 space-y-4">
                <span className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin size={18} className="text-orange-400" /> Địa chỉ người bán (điểm lấy hàng)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Tỉnh / Thành phố *</label>
                    <select name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-[#14161d] border border-white/10 rounded-lg p-3 text-sm text-white focus:border-orange-500 outline-none cursor-pointer">
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">Quận / Huyện *</label>
                    <select name="district" value={formData.district} onChange={handleInputChange} className="w-full bg-[#14161d] border border-white/10 rounded-lg p-3 text-sm text-white focus:border-orange-500 outline-none cursor-pointer">
                      <option value="Quận 5">Quận 5</option>
                      <option value="Quận 1">Quận 1</option>
                      <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Địa chỉ chi tiết (Số nhà, tên đường) *</label>
                  <input
                    type="text"
                    name="specificAddress"
                    value={formData.specificAddress}
                    onChange={handleInputChange}
                    placeholder="Nhập số nhà, tên đường, phường/xã..."
                    className="w-full bg-[#14161d] border border-white/10 rounded-lg p-3 text-sm text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-white/5 text-xs text-gray-500 font-semibold tracking-wide uppercase">
                   GIAO HÀNG TOÀN QUỐC · GHN · GHTK · BEST
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8 h-fit">
            <div className="bg-[#14161d] p-8 rounded-xl border border-white/5 shadow-xl space-y-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5 border-b border-white/5 pb-4">
                <span className="w-2 h-5 bg-orange-500 rounded-full"></span>
                Hình ảnh sản phẩm *
              </h2>
              
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              
              <div 
                onClick={triggerFileInput}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition text-center group ${
                  isDragging ? "border-orange-500 bg-orange-500/5" : "border-white/10 bg-[#0f1117] hover:border-orange-500/40"
                }`}
              >
                <Upload size={36} className="text-gray-500 group-hover:text-orange-400 transition" />
                <p className="text-lg font-bold text-gray-300">Kéo thả ảnh vào đây</p>
                <p className="text-sm text-gray-500">Tối đa 8 ảnh</p>
                <button type="button" className="mt-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold rounded-lg text-gray-300 transition cursor-pointer">
                  Chọn ảnh
                </button>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {imagePreviews.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-[#0f1117] border border-white/10">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(idx); }} className="absolute top-1.5 right-1.5 p-1.5 bg-black/70 rounded-full text-gray-400 hover:text-white cursor-pointer">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-[#14161d] p-8 rounded-xl border border-white/5 shadow-xl space-y-6">
              <h2 className="text-lg font-bold text-gray-300 flex items-center gap-2 border-b border-white/5 pb-4">
                <Eye size={20} /> Xem trước listing
              </h2>

              <div className="bg-[#0f1117] rounded-xl border border-white/5 overflow-hidden p-6 space-y-5">
                <div className="aspect-[4/3] bg-slate-800 rounded-lg w-full overflow-hidden relative flex items-center justify-center text-gray-500 text-base">
                  {imagePreviews.length > 0 ? (
                    <img src={imagePreviews[0]} alt="bìa" className="w-full h-full object-cover" />
                  ) : (
                    "Chưa có hình ảnh"
                  )}
                  <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1.5 rounded font-bold uppercase tracking-wider shadow-lg">
                    {formData.category === "Khác" ? (formData.customCategory || "Khác") : formData.category}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`aspect-[5/4] rounded bg-[#14161d] border flex items-center justify-center text-xs text-gray-600 overflow-hidden ${
                        i === 0 ? "border-orange-500/60" : "border-white/5"
                      }`}
                    >
                      {imagePreviews[i] ? (
                        <img src={imagePreviews[i]} alt={`thumbnail-${i}`} className="w-full h-full object-cover" />
                      ) : (
                        "-"
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug">
                    {formData.name || "Tên sản phẩm thiết lập..."}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                    <Clock size={16} className="text-red-400" />
                    <span>Bắt đầu: {formData.startDate ? new Date(formData.startDate).toLocaleString("vi-VN") : "..."}</span>
                  </div>
                </div>

                <div className="pt-5 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Giá khởi điểm</p>
                    <p className="text-xl font-black text-orange-400 mt-1.5">
                      {Number(formData.startPrice).toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="w-full py-3.5 text-sm font-bold rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 transition cursor-pointer"
                >
                  Xem trước mẫu hiển thị
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-lg font-black rounded-lg bg-[#f97316] hover:bg-orange-600 disabled:opacity-50 text-white transition shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  {loading ? "Đang xử lý..." : "Đăng sản phẩm ngay"}
                </button>
              </div>
            </div>
          </div>

        </form>
      </main>

      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-[#14161d] w-full max-w-4xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition z-10 cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <div className="w-full md:w-1/2 bg-[#0f1117] flex items-center justify-center p-8 border-r border-white/5">
              <div className="aspect-square w-full bg-[#14161d] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden relative">
                 {imagePreviews.length > 0 ? (
                    <img src={imagePreviews[0]} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <Eye size={48} className="text-gray-800" />
                  )}
                  <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1.5 rounded font-bold uppercase tracking-wider shadow-lg">
                    {formData.category === "Khác" ? (formData.customCategory || "Khác") : formData.category}
                  </span>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
              <div className="flex-1">
                 <h2 className="text-2xl font-bold text-white leading-snug">
                   {formData.name || "Tên sản phẩm thiết lập..."}
                 </h2>
                 <div className="flex items-center gap-3 mt-4 text-sm font-medium text-gray-400">
                    <span className="bg-white/5 px-3 py-1 rounded-lg">Tình trạng: <span className="text-white">{formData.condition}</span></span>
                    {formData.hasWarranty && <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-lg">Có bảo hành</span>}
                 </div>
                 
                 <div className="mt-6">
                    <h3 className="text-sm font-bold text-white mb-2">Mô tả sản phẩm:</h3>
                    <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                      {formData.description || "Chưa có thông tin mô tả chi tiết cho sản phẩm này."}
                    </p>
                 </div>
              </div>
              
              <div className="mt-8 bg-[#0f1117] p-5 rounded-xl border border-white/5 space-y-4">
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Giá khởi điểm</p>
                      <p className="text-3xl font-black text-orange-400 mt-1">
                         {Number(formData.startPrice).toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Mức tăng tối thiểu</p>
                      <p className="text-lg font-bold text-white mt-1">
                         {Number(formData.minIncrement).toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock size={16} className="text-red-400" />
                    <span>Thời gian diễn ra: <strong className="text-white">{formData.duration}</strong></span>
                 </div>
                 <button className="w-full py-3.5 text-sm font-black rounded-lg bg-white/10 text-gray-500 cursor-not-allowed mt-2">
                    Tham gia đấu giá (Chỉ xem trước)
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}