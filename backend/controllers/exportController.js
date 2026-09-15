import XLSX from "xlsx";

import Organization from "../models/Organization.js";
import Leads from "../models/Leads.js";
 

export const exportData = async (req, res) => {
  try {
    // ==========================================
    // GET DATA
    // ==========================================

    const organizations = await Organization.find()
      .populate("owner", "name email")
      .lean();

    const leads = await Leads.find()
      .populate("owner", "name email")
      .lean();

    

    // ==========================================
    // ORGANIZATIONS
    // ==========================================

    const organizationData = organizations.map((item) => ({
      ID: item._id?.toString() || "",
      Name: item.name || "",
      Website: item.website || "",
      Owner: item.owner?.name || "",
      Phone: item.phone || "",
      Email: item.email || "",
      Address: item.address || "",
      BookingPal: item.currentBookingPalAccount || "",
      NextListingExpirationDate:
        item.nextListingExpirationDate || "",
      EcbYoPass: item.ecbyoPass || "",
      PMSUsed: item.pmsUsed || "",
      TotalUnitsManaged: item.totalUnitsManaged ?? "",
      UnitsOnEcbYo: item.unitsOnEcbyo ?? "",
      ListingId: item.listingId || "",
      FeedDataLink: item.feedDataLink || "",
      Facebook: item.facebook || "",
      LinkedIn: item.linkedin || "",
    }));

    // ==========================================
    // LEADS
    // ==========================================

    const leadData = leads.map((item) => ({
      ID: item._id?.toString() || "",
      Name: item.name || "",
      Email: item.email || "",
      Phone: item.phone || "",
      Website: item.website || "",
      Owner: item.owner?.name || "",
      Organization:
        item.organization?.name ||
        item.organization ||
        "",
      Status: item.status || "",
      Source: item.source || "",
      CreatedAt: item.createdAt || "",
    }));

    // ==========================================
    // DEALS
    // ==========================================

    // const dealData = deals.map((item) => ({
    //   ID: item._id?.toString() || "",
    //   Title: item.title || item.name || "",
    //   Value: item.value ?? item.amount ?? "",
    //   Owner: item.owner?.name || "",
    //   Status: item.status || "",
    //   CreatedAt: item.createdAt || "",
    // }));

    // ==========================================
    // CREATE EXCEL WORKBOOK
    // ==========================================

    const workbook = XLSX.utils.book_new();

    const organizationSheet =
      XLSX.utils.json_to_sheet(organizationData);

    const leadSheet =
      XLSX.utils.json_to_sheet(leadData);

    // const dealSheet =
    //   XLSX.utils.json_to_sheet(dealData);

    XLSX.utils.book_append_sheet(
      workbook,
      organizationSheet,
      "Organizations"
    );

    XLSX.utils.book_append_sheet(
      workbook,
      leadSheet,
      "Leads"
    );

    // XLSX.utils.book_append_sheet(
    //   workbook,
    // //   dealSheet,
    // //   "Deals"
    // );

    // ==========================================
    // CREATE XLSX BUFFER
    // ==========================================

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    // ==========================================
    // DOWNLOAD
    // ==========================================

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="crm-data.xlsx"'
    );

    res.send(buffer);

  } catch (error) {
    console.error("Export data error:", error);

    res.status(500).json({
      message: "Failed to export data",
      error: error.message,
    });
  }
};