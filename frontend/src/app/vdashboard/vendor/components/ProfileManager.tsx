"use client";

import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

interface Props {
  preview?: boolean;
}

export default function ProfileManager({ preview = false }: Props) {
  const { vendorProfile, updateVendorProfile, fetchVendorMe } = useAppContext();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [showAddServicePopup, setShowAddServicePopup] = useState(false);
  const [newServiceCategory, setNewServiceCategory] = useState("");
  const [savingServiceCategory, setSavingServiceCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedCategory, setEditedCategory] = useState("");
  const [savingEditedCategory, setSavingEditedCategory] = useState(false);
  const [showAddAreaPopup, setShowAddAreaPopup] = useState(false);
  const [newServiceArea, setNewServiceArea] = useState("");
  const [savingServiceArea, setSavingServiceArea] = useState(false);
  const [editingArea, setEditingArea] = useState<string | null>(null);
  const [editedArea, setEditedArea] = useState("");
  const [savingEditedArea, setSavingEditedArea] = useState(false);

  const [showAddPackagePopup, setShowAddPackagePopup] = useState(false);
  const [newPackage, setNewPackage] = useState({
    name: "",
    price: 0,
    currency: "Ksh ",
    features: [] as string[],
  });
  const [editingPackageIndex, setEditingPackageIndex] = useState<number | null>(null);
  const [editedPackage, setEditedPackage] = useState({
    name: "",
    price: 0,
    currency: "USD",
    features: [] as string[],
  });
  const [savingPackage, setSavingPackage] = useState(false);



  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    location: "",
    website: "",
    description: "",
    phone: "",
    email: "",
    profilePhoto: null as File | string | null,
    coverPhoto: null as File | string | null,
  });


  /** --------------------------
   *  NEW STATES FOR IMAGE UPLOAD
   ----------------------------*/
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageTarget, setImageTarget] =
    useState<"profilePhoto" | "coverPhoto" | null>(null);

  const profileInputRef = React.useRef<HTMLInputElement>(null);
  const coverInputRef = React.useRef<HTMLInputElement>(null);

  const openFilePicker = (target: "profilePhoto" | "coverPhoto") => {
    setImageTarget(target);
    if (target === "profilePhoto") profileInputRef.current?.click();
    if (target === "coverPhoto") coverInputRef.current?.click();
  };


  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "profilePhoto" | "coverPhoto"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    setFormData(prev => ({
      ...prev,
      [target]: file, // store raw file in formData
    }));

    setSelectedImage(url);
    setSelectedFile(file);
    setImageTarget(target);
  };


  const VENDOR_CATEGORIES = [
    "Photography",
    "Catering",
    "Venue",
    "Entertainment",
    "Decoration",
    "Makeup Artist",
    "Dresses",
    "Groom Wear",
    "Wedding Planner",
    "Florist",
    "Cars",
    "Cake",
    "Tailor",
    "Makeup & Beauty",
    "MC / Host",
    "Other",
  ];

  const COUNTIES = [
    "Nairobi",
    "Mombasa",
    "Kiambu",
    "Nakuru",
    "Machakos",
    "Kajiado",
    "Uasin Gishu",
    "Nyeri",
    "Meru",
    "Embu",
    "Laikipia",
    "Kisumu",
    "Kericho",
    "Bomet",
    "Narok",
    "Murang'a",
    "Kirinyaga",
    "Nyandarua",
    "Tharaka Nithi",
    "Isiolo",
    "Garissa",
    "Wajir",
    "Mandera",
    "Marsabit",
    "Samburu",
    "Turkana",
    "West Pokot",
    "Trans Nzoia",
    "Elgeyo Marakwet",
    "Nandi",
    "Bungoma",
    "Busia",
    "Kakamega",
    "Vihiga",
    "Siaya",
    "Homa Bay",
    "Migori",
    "Kisii",
    "Nyamira",
    "Taita Taveta",
    "Kwale",
    "Kilifi",
    "Lamu",
    "Tana River",
  ];

  const PACKAGE_NAMES = ["Essential", "Premium", "Luxury"];




  /** -------------------------- */

  useEffect(() => {
    fetchVendorMe();
  }, []);

  useEffect(() => {
    if (vendorProfile && !isEditing) {
      setFormData(prev => ({
        ...prev,
        businessName: vendorProfile.businessName || "",
        category: vendorProfile.category || "",
        location: vendorProfile.location || "",
        website: vendorProfile.website || "",
        description: vendorProfile.description || "",
        phone: vendorProfile.phone || "",
        email: vendorProfile.email || "",
      }));
    }
  }, [vendorProfile, isEditing]);

  const uploadImageImmediately = async () => {
    if (!imageTarget) return;

    const file = formData[imageTarget];
    if (!(file instanceof File)) return;

    setIsSavingImage(true); // <-- Start loading

    const fdKey = imageTarget; // profilePhoto OR coverPhoto

    const fd = new FormData();
    fd.append(fdKey, file);

    const updated = await updateVendorProfile(fd);

    if (updated) {
      await fetchVendorMe();
      localStorage.setItem("vendorProfile", JSON.stringify(updated));
    }

    setIsSavingImage(false); // <-- Stop loading

    // close modal
    setSelectedImage(null);
    setSelectedFile(null);
    setImageTarget(null);
  };

  const openAddServicePopup = () => {
    setNewServiceCategory("");
    setShowAddServicePopup(true);
  };

  const saveNewServiceCategory = async () => {
    const trimmed = newServiceCategory.trim();
    if (!trimmed) return;

    setSavingServiceCategory(true);

    try {
      const currentCategories = vendorProfile?.serviceCategories || [];
      const updatedCategories = [...currentCategories, trimmed];

      // Use FormData like image upload
      const fd = new FormData();
      fd.append("serviceCategories", JSON.stringify(updatedCategories));

      const updated = await updateVendorProfile(fd);

      if (updated) {
        await fetchVendorMe(); // sync fresh data from server
        localStorage.setItem("vendorProfile", JSON.stringify(updated));
        setShowAddServicePopup(false);
      }
    } catch (error) {
      console.error("Failed to save service category", error);
      alert("Failed to save service category. Please try again.");
    } finally {
      setSavingServiceCategory(false);
    }
  };

  const saveEditedCategory = async () => {
    if (!editedCategory.trim() || !editingCategory) return;

    setSavingEditedCategory(true);
    try {
      const updatedCategories = vendorProfile?.serviceCategories?.map(cat =>
        cat === editingCategory ? editedCategory.trim() : cat
      ) || [];

      const fd = new FormData();
      fd.append("serviceCategories", JSON.stringify(updatedCategories));

      const updated = await updateVendorProfile(fd);

      if (updated) {
        await fetchVendorMe();
        localStorage.setItem("vendorProfile", JSON.stringify(updated));
        setEditingCategory(null);
      }
    } catch (error) {
      console.error("Failed to edit category", error);
      alert("Failed to edit category. Please try again.");
    } finally {
      setSavingEditedCategory(false);
    }
  };

  const deleteCategory = async (catToDelete: string) => {
    if (!catToDelete) return;

    setSavingEditedCategory(true);
    try {
      const updatedCategories = vendorProfile?.serviceCategories?.filter(
        cat => cat !== catToDelete
      ) || [];

      const fd = new FormData();
      fd.append("serviceCategories", JSON.stringify(updatedCategories));

      const updated = await updateVendorProfile(fd);

      if (updated) {
        await fetchVendorMe();
        localStorage.setItem("vendorProfile", JSON.stringify(updated));
        setEditingCategory(null);
      }
    } catch (error) {
      console.error("Failed to delete category", error);
      alert("Failed to delete category. Please try again.");
    } finally {
      setSavingEditedCategory(false);
    }
  };

  // Add new area
  const saveNewServiceArea = async () => {
    const trimmed = newServiceArea.trim();
    if (!trimmed) return;

    setSavingServiceArea(true);

    try {
      const currentAreas = vendorProfile?.serviceAreas || [];
      const updatedAreas = [...currentAreas, trimmed];

      const fd = new FormData();
      fd.append("serviceAreas", JSON.stringify(updatedAreas));

      const updated = await updateVendorProfile(fd);

      if (updated) {
        fetchVendorMe();
        localStorage.setItem("vendorProfile", JSON.stringify(updated));
        setShowAddAreaPopup(false);
      }
    } catch (error) {
      console.error("Failed to save service area", error);
      alert("Failed to save service area. Please try again.");
    } finally {
      setSavingServiceArea(false);
    }
  };

  const saveEditedArea = async () => {
    if (!editingArea) return;
    const trimmed = editedArea.trim();
    if (!trimmed) return;

    setSavingEditedArea(true);
    try {
      const updatedAreas = (vendorProfile?.serviceAreas || []).map(area =>
        area === editingArea ? trimmed : area
      );

      const fd = new FormData();
      fd.append("serviceAreas", JSON.stringify(updatedAreas));

      const updated = await updateVendorProfile(fd);

      if (updated) {
        fetchVendorMe();
        localStorage.setItem("vendorProfile", JSON.stringify(updated));
        setEditingArea(null);
      }
    } catch (error) {
      console.error("Failed to edit service area", error);
      alert("Failed to edit service area. Please try again.");
    } finally {
      setSavingEditedArea(false);
    }
  };

  const deleteArea = async (areaToDelete: string) => {
    if (!areaToDelete) return;

    setSavingEditedArea(true);
    try {
      const updatedAreas = (vendorProfile?.serviceAreas || []).filter(area => area !== areaToDelete);

      const fd = new FormData();
      fd.append("serviceAreas", JSON.stringify(updatedAreas));

      const updated = await updateVendorProfile(fd);

      if (updated) {
        fetchVendorMe();
        localStorage.setItem("vendorProfile", JSON.stringify(updated));
        setEditingArea(null);
      }
    } catch (error) {
      console.error("Failed to delete service area", error);
      alert("Failed to delete service area. Please try again.");
    } finally {
      setSavingEditedArea(false);
    }
  };
  // Add new package
  const saveNewPackage = async () => {
    const trimmedName = newPackage.name.trim();
    if (!trimmedName) return;

    setSavingPackage(true);
    try {
      const currentPackages = vendorProfile?.pricingPackages || [];
      const updatedPackages = [...currentPackages, newPackage];

      const fd = new FormData();
      fd.append("pricingPackages", JSON.stringify(updatedPackages));

      const updated = await updateVendorProfile(fd);

      if (updated) {
        fetchVendorMe();
        localStorage.setItem("vendorProfile", JSON.stringify(updated));
        setShowAddPackagePopup(false);
        setNewPackage({ name: "", price: 0, currency: "USD", features: [] });
      }
    } catch (error) {
      console.error("Failed to save package", error);
      alert("Failed to save package. Please try again.");
    } finally {
      setSavingPackage(false);
    }
  };

  // Edit existing package
  const saveEditedPackage = async () => {
    if (editingPackageIndex === null) return;
    if (!editedPackage.name.trim()) return;

    setSavingPackage(true);
    try {
      const updatedPackages = (vendorProfile?.pricingPackages || []).map((pkg, idx) =>
        idx === editingPackageIndex ? editedPackage : pkg
      );

      const fd = new FormData();
      fd.append("pricingPackages", JSON.stringify(updatedPackages));

      const updated = await updateVendorProfile(fd);

      if (updated) {
        fetchVendorMe();
        localStorage.setItem("vendorProfile", JSON.stringify(updated));
        setEditingPackageIndex(null);
      }
    } catch (error) {
      console.error("Failed to edit package", error);
      alert("Failed to edit package. Please try again.");
    } finally {
      setSavingPackage(false);
    }
  };

  // Delete package
  const deletePackage = async (index: number) => {
    setSavingPackage(true);
    try {
      const updatedPackages = (vendorProfile?.pricingPackages || []).filter((_, idx) => idx !== index);

      const fd = new FormData();
      fd.append("pricingPackages", JSON.stringify(updatedPackages));

      const updated = await updateVendorProfile(fd);

      if (updated) {
        fetchVendorMe();
        localStorage.setItem("vendorProfile", JSON.stringify(updated));
        setEditingPackageIndex(null);
      }
    } catch (error) {
      console.error("Failed to delete package", error);
      alert("Failed to delete package. Please try again.");
    } finally {
      setSavingPackage(false);
    }
  };




  const handleChange = (e: any) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();

    Object.keys(formData).forEach(key => {
      fd.append(key, formData[key as keyof typeof formData] as any);
    });

    const updated = await updateVendorProfile(fd);

    if (updated) setIsEditing(false);
    setLoading(false);
  };

  const profilePhoto = vendorProfile?.profilePhoto || "/assets/avatar.png";
  const coverPhoto = vendorProfile?.coverPhoto || "/assets/cover-placeholder.jpg";


  /** ------------------------------------------------
   *  HIDDEN FILE INPUTS (NEW)
   --------------------------------------------------*/
  const fileInputs = (
    <>
      <input
        ref={profileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageSelect(e, "profilePhoto")}
      />

      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageSelect(e, "coverPhoto")}
      />
    </>
  );

  /** ------------------------------------------------
   *  IMAGE PREVIEW MODAL (NEW)
   --------------------------------------------------*/
  const previewModal = selectedImage && (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-xl">
        <h3 className="text-lg font-semibold mb-4">
          Preview {imageTarget === "profilePhoto" ? "Profile Photo" : "Cover Photo"}
        </h3>

        <img
          src={selectedImage}
          className="w-full rounded-lg object-cover max-h-[300px]"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onClick={() => {
              setSelectedImage(null);
              setSelectedFile(null);
            }}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-[#4b1bb4] text-white rounded-lg disabled:opacity-50"
            onClick={uploadImageImmediately}
            disabled={isSavingImage}
          >
            {isSavingImage ? "Saving..." : "Save"}
          </button>



        </div>
      </div>
    </div>
  );

  /** -------------------------- */

 {/* if (preview) {
    return (
      <section className="bg-white shadow-sm rounded-2xl p-2">
        <h2 className="text-2xl font-semibold text-center text-[#311970] mb-4">
          My Profile
        </h2>
        <div>
          <p className="text-gray-800 font-semibold text-sm">
            {vendorProfile?.businessName}
          </p>
          <p className="text-sm text-gray-500">
            {vendorProfile?.category} • {vendorProfile?.location}
          </p>
        </div>
      </section>
    );
  }*/}

  if (!isEditing && vendorProfile) {
    return (
      <div className="p-2">

        {fileInputs}
        {previewModal}

        {/* PAGE HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl ml-4 font-extrabold text-gray-900">
            Profile Settings
          </h1>
          <p className="text-gray-600 mt-1 ml-4 text-sm">
            Manage your business information and preferences
          </p>
        </div>

        <div className="rounded-2xl shadow">
          {/* COVER PHOTO */}
          <div className="relative rounded-1xl overflow-hidden">
            <img
              src={coverPhoto}
              alt="Cover"
              className="w-full h-[180px] object-cover"
            />

            <button
              onClick={() => openFilePicker("coverPhoto")}
              className="absolute top-4 right-4 bg-gray-200 text-gray-700 rounded-md px-4 py-2 flex items-center gap-2 hover:bg-gray-300 transition"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                <circle cx="12" cy="13" r="3"></circle>
              </svg>
              Change Cover
            </button>
          </div>

          {/* PROFILE AVATAR */}
          <div className="relative w-full px-8 py-6 flex -mt-[65px] mb-8 items-end gap-2">
            <div className="relative w-[130px] h-[130px]">

              <div className="w-full h-full bg-[#eee] rounded-full border-4 border-white overflow-hidden shadow-lg relative">
                <Image
                  src={profilePhoto}
                  alt="Profile photo"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Camera Button */}
              <button
                onClick={() => openFilePicker("profilePhoto")}
                className="absolute bottom-5 right-5 translate-x-1/2 translate-y-1/2 p-2 rounded-full bg-[#4b1bb4] text-white shadow-md hover:shadow-lg transition-shadow z-10"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                  <circle cx="12" cy="13" r="3"></circle>
                </svg>
              </button>
            </div>

            {/* BUSINESS NAME + CATEGORY + VERIFIED */}
            <div className="flex flex-1 justify-between items-center">
              <div>
                <h6 className="text-1xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
                  {vendorProfile.businessName}
                </h6>
                <p className="text-gray-500 text-sm">{vendorProfile.category}</p>
              </div>
              {/*<div className="inline-flex rounded-full bg-green-100 px-2 py-1 text-green-700 font-medium text-xs h-6 items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3 h-3"
                >
                  <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                  <path d="m9 11 3 3L22 4"></path>
                </svg>
                <span>Verified</span>
              </div>*/}
            </div>
          </div>
        </div>

        {/* REMAINDER OF YOUR ORIGINAL CODE UNTOUCHED (BUSINESS INFO / SERVICES / SETTINGS / ETC) */}
        {/* ----------------------------------------------------------------------------- */}
        {/* ----------------------------------------------------------------------------- */}

        {/* BUSINESS INFORMATION */}
        <div className="bg-white rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Business Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Business Name</p>
              <p className="text-gray-900 mt-1">{vendorProfile.businessName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-semibold">Contact Email</p>
              <p className="text-gray-900 mt-1">{vendorProfile.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-semibold">Phone Number</p>
              <p className="text-gray-900 mt-1">{vendorProfile.phone}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 font-semibold">Website</p>
              <a
                href={vendorProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4b1bb4] hover:underline mt-1 block break-all"
              >
                {vendorProfile.website}
              </a>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500 font-semibold">About Your Business</p>
            <p className="mt-2 text-gray-700 leading-relaxed">
              {vendorProfile.description}
            </p>
          </div>
          <div className="text-end mb-6 mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#4b1bb4] text-white text-sm rounded-xl shadow hover:bg-[#3a1591]"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* SERVICE CATEGORIES */}
        <div className="bg-white rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Service Categories
          </h3>
          <div className="flex flex-wrap gap-3">
            {vendorProfile?.serviceCategories && vendorProfile.serviceCategories.length > 0 ? (
              vendorProfile.serviceCategories.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-5 py-2 bg-[#4b1bb4] text-white rounded-full text-sm font-medium cursor-pointer hover:opacity-80"
                  onClick={() => {
                    setEditingCategory(cat);
                    setEditedCategory(cat);
                  }}
                >
                  {cat}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No service categories added yet.</p>
            )}

          </div>
          {editingCategory && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
                <h4 className="mb-4 text-lg font-semibold">Edit Service Category</h4>
                <input
                  type="text"
                  value={editedCategory}
                  onChange={(e) => setEditedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                  autoFocus
                  disabled={savingEditedCategory}
                />
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => setEditingCategory(null)}
                    disabled={savingEditedCategory}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => deleteCategory(editingCategory)}
                    disabled={savingEditedCategory}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-[#4b1bb4] text-white rounded"
                    onClick={saveEditedCategory}
                    disabled={savingEditedCategory}
                  >
                    {savingEditedCategory ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}


          <button
            onClick={openAddServicePopup}
            className="px-5 py-2 mt-3 rounded-full text-gray-500 bg-gray-100 text-sm"
          >
            + Add Service
          </button>

          {/* Add Service Category Popup */}
          {showAddServicePopup && (
            <div className="fixed inset-0 bg-black/50 bg-opacity-60 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
                <h4 className="mb-4 text-lg font-semibold">Add Service Category</h4>
                <input
                  type="text"
                  placeholder="Enter service category"
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value)}
                  disabled={savingServiceCategory}
                  autoFocus
                />
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => setShowAddServicePopup(false)}
                    disabled={savingServiceCategory}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-[#4b1bb4] text-white rounded"
                    onClick={saveNewServiceCategory}
                    disabled={savingServiceCategory}
                  >
                    {savingServiceCategory ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* SERVICE AREAS */}
        <div className="bg-white rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Service Areas
          </h3>
          <div className="flex flex-wrap gap-3">
            {(vendorProfile?.serviceAreas || []).length > 0 ? (
              (vendorProfile.serviceAreas || []).map((area, idx) => (
                <span
                  key={idx}
                  className="px-5 py-2 bg-[#4b1bb4] text-white rounded-full text-sm font-medium cursor-pointer"
                  onClick={() => {
                    setEditingArea(area);
                    setEditedArea(area);
                  }}
                >
                  {area}
                </span>
              ))
            ) : (
              <p className="text-gray-500">No service areas added yet.</p>
            )}
          </div>
          {editingArea && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
                <h4 className="mb-4 text-lg font-semibold">Edit Service Area</h4>
                <input
                  type="text"
                  value={editedArea}
                  onChange={(e) => setEditedArea(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                  autoFocus
                  disabled={savingEditedArea}
                />
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => setEditingArea(null)}
                    disabled={savingEditedArea}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => deleteArea(editingArea)}
                    disabled={savingEditedArea}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-[#4b1bb4] text-white rounded"
                    onClick={saveEditedArea}
                    disabled={savingEditedArea}
                  >
                    {savingEditedArea ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              setNewServiceArea("");
              setShowAddAreaPopup(true);
            }}
            className="px-5 py-2 mt-3 rounded-full text-gray-500 bg-gray-100 text-sm"
          >
            + Add Area
          </button>
          {showAddAreaPopup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
                <h4 className="mb-4 text-lg font-semibold">Add Service Area</h4>
                <input
                  type="text"
                  value={newServiceArea}
                  onChange={(e) => setNewServiceArea(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                  autoFocus
                  disabled={savingServiceArea}
                />
                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => setShowAddAreaPopup(false)}
                    disabled={savingServiceArea}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-[#4b1bb4] text-white rounded"
                    onClick={saveNewServiceArea}
                    disabled={savingServiceArea}
                  >
                    {savingServiceArea ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PRICING PACKAGES */}
        <div className="bg-white rounded-2xl shadow p-8 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Pricing Packages
            </h3>
            <button
              className="px-5 py-2 bg-gray-100 rounded-xl text-gray-700 text-sm"
              onClick={() => {
                setNewPackage({ name: "", price: 0, currency: "Ksh ", features: [""] });
                setShowAddPackagePopup(true);
              }}
            >
              + Add Package
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {vendorProfile?.pricingPackages && vendorProfile.pricingPackages.length > 0 ? (
              vendorProfile.pricingPackages.map((pkg, idx) => {
                const name = pkg.name || "Unnamed Package";
                const price = pkg.price ?? 0; // fallback to 0
                const currency = pkg.currency || "Ksh ";
                const features = pkg.features || [];

                return (
                  <div
                    key={idx}
                    className="rounded-2xl shadow p-6 cursor-pointer hover:ring-2 hover:ring-[#4b1bb4]"
                    onClick={() => {
                      setEditingPackageIndex(idx);
                      const name = pkg.name || "";
                      const price = pkg.price ?? 0;
                      const currency = pkg.currency || "Ksh ";
                      const features = pkg.features && pkg.features.length > 0 ? pkg.features : [""];
                      setEditedPackage({ name, price, currency, features });
                    }}

                  >
                    <h4 className="font-semibold text-lg">{name}</h4>
                    <p className="text-[#4b1bb4] text-2xl font-bold mt-2">
                      {currency}{price.toLocaleString()}
                    </p>
                    {features.length > 0 && (
                      <ul className="mt-4 space-y-2 text-sm text-gray-700">
                        {features.map((f, i) => (
                          <li key={i}>✔ {f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 col-span-3">No pricing packages added yet.</p>
            )}

          </div>

          {/* Add Package Popup */}
          {showAddPackagePopup && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
                <h4 className="mb-4 text-lg font-semibold">Add Pricing Package</h4>

                {/* Name, Price, Currency */}
                <select
                  value={newPackage.name}
                  onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2 bg-white"
                >
                  <option value="">Select Package Type</option>
                  {PACKAGE_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Price"
                  value={newPackage.price}
                  onChange={(e) => setNewPackage({ ...newPackage, price: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                />
                <input
                  type="text"
                  placeholder="Currency"
                  value={newPackage.currency}
                  onChange={(e) => setNewPackage({ ...newPackage, currency: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                />

                {/* Features Inputs */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">Features / Offerings</label>
                  {newPackage.features?.map((f, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={f}
                        onChange={(e) => {
                          const updated = [...newPackage.features];
                          updated[i] = e.target.value;
                          setNewPackage({ ...newPackage, features: updated });
                        }}
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                      />
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded"
                        onClick={() => {
                          const updated = newPackage.features.filter((_, idx) => idx !== i);
                          setNewPackage({ ...newPackage, features: updated });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    className="px-3 py-2 bg-gray-100 rounded text-sm"
                    onClick={() =>
                      setNewPackage({ ...newPackage, features: [...(newPackage.features || []), ""] })
                    }
                  >
                    + Add Feature
                  </button>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => setShowAddPackagePopup(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-[#4b1bb4] text-white rounded"
                    onClick={saveNewPackage}
                    disabled={savingPackage}
                  >
                    {savingPackage ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Package Popup */}
          {editingPackageIndex !== null && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
                <h4 className="mb-4 text-lg font-semibold">Edit Pricing Package</h4>

                {/* Name, Price, Currency */}
                <input
                  type="text"
                  placeholder="Name"
                  value={editedPackage.name}
                  onChange={(e) => setEditedPackage({ ...editedPackage, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                  autoFocus
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={editedPackage.price}
                  onChange={(e) => setEditedPackage({ ...editedPackage, price: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                />
                <input
                  type="text"
                  placeholder="Currency"
                  value={editedPackage.currency}
                  onChange={(e) => setEditedPackage({ ...editedPackage, currency: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                />

                {/* Features Inputs */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-gray-700">Features / Offerings</label>
                  {editedPackage.features?.map((f, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={f}
                        onChange={(e) => {
                          const updated = [...editedPackage.features];
                          updated[i] = e.target.value;
                          setEditedPackage({ ...editedPackage, features: updated });
                        }}
                        className="flex-1 border border-gray-300 rounded px-3 py-2"
                      />
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded"
                        onClick={() => {
                          const updated = editedPackage.features.filter((_, idx) => idx !== i);
                          setEditedPackage({ ...editedPackage, features: updated });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    className="px-3 py-2 bg-gray-100 rounded text-sm"
                    onClick={() =>
                      setEditedPackage({ ...editedPackage, features: [...(editedPackage.features || []), ""] })
                    }
                  >
                    + Add Feature
                  </button>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={() => setEditingPackageIndex(null)}
                    disabled={savingPackage}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded"
                    onClick={() => deletePackage(editingPackageIndex!)}
                    disabled={savingPackage}
                  >
                    Delete
                  </button>
                  <button
                    className="px-4 py-2 bg-[#4b1bb4] text-white rounded"
                    onClick={saveEditedPackage}
                    disabled={savingPackage}
                  >
                    {savingPackage ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* VERIFICATION & DOCUMENTS */}
        <div className="bg-white rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Verification & Documents
          </h3>

          {/* EMAIL VERIFIED */}
          <div className="w-full bg-green-50 border border-green-100 rounded-xl p-5 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M21 7L9 19l-5-5" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Email Verified</p>
                <p className="text-gray-600 text-sm">{vendorProfile?.email}</p>
              </div>
            </div>
          </div>

          {/* BUSINESS DOCUMENTS PENDING */}
          <div className="w-full bg-yellow-50 border border-yellow-100 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-yellow-600"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Business Documents Pending</p>
                <p className="text-gray-600 text-sm">
                  Upload GST or PAN for verification
                </p>
              </div>
            </div>

            <button
              className="px-4 py-2 rounded-xl bg-white border text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-2"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              Upload
            </button>
          </div>
        </div>

        {/* AVAILABILITY SETTINGS */}
        <div className="bg-white rounded-2xl shadow p-8 mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Availability Settings
          </h3>

          <div className="space-y-5">

            {/* Instant Inquiries */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Accept Instant Inquiries</p>
                <p className="text-sm text-gray-500">
                  Allow couples to send you inquiries directly
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-[#4b1bb4] transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>
            </div>

            {/* Availability Calendar */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Show Availability Calendar</p>
                <p className="text-sm text-gray-500">
                  Display your available dates on your profile
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-[#4b1bb4] transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">Email Notifications</p>
                <p className="text-sm text-gray-500">
                  Get notified for new inquiries and messages
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" className="peer sr-only" defaultChecked />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-[#4b1bb4] transition"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5"></div>
              </label>
            </div>

          </div>
        </div>

        {/*<button
          className="btn-primary flex items-center gap-2 bg-[#4b1bb4] hover:bg-[#3a1591] text-white px-5 py-2.5 rounded-xl shadow transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
            <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"></path>
            <path d="M7 3v4a1 1 0 0 0 1 1h7"></path>
          </svg>
          Save Changes
        </button>*/}
      </div>
    );
  }

  // EDIT MODE (Category as dropdown)
  return (
    <div className="bg-white rounded-2xl shadow p-10">
      <h2 className="text-2xl font-bold text-[#311970] mb-8">Edit Profile</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Business Name */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Business Name
          </label>
          <input
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-[#311970]"
          />
        </div>

        {/* Category (DROPDOWN) */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-[#311970] bg-white"
          >
            <option value="">Select a category</option>
            {VENDOR_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Location
          </label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-[#311970] bg-white"
          >
            <option value="">Select a county</option>
            {COUNTIES.map((county) => (
              <option key={county} value={county}>
                {county}
              </option>
            ))}
          </select>

        </div>

        {/* Website */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Website
          </label>
          <input
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-[#311970]"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Phone Number
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-[#311970]"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Email
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-[#311970]"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Business Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full min-h-[140px] px-4 py-3 rounded-xl shadow-sm focus:ring-2 focus:ring-[#311970]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 bg-[#311970] text-white py-3 rounded-xl shadow hover:bg-[#261457]"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
