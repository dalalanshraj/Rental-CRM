import Deal from "../models/Deals.js";
import Leads from "../models/Leads.js";


// CREATE DEAL
export const createDeals = async (req, res) => {
  try {
    let { products } = req.body;
    let totalValue = 0;

    if (products && products.length > 0) {
      products = products.map(item => {
        const base = (item.price || 0) * (item.quantity || 0);
        const taxAmount = (base * (item.tax || 0)) / 100;
        const amount = base + taxAmount;

        totalValue += amount;

        return {
          ...item,
          amount
        };
      });
    }

    const deal = await Deal.create({
      ...req.body,
      products,
      value: totalValue,
      owner: req.user.id
    });

    const populatedDeal = await Deal.findById(deal._id)
      .populate("owner", "name email")
      .populate("lead", "name organization");

    res.status(201).json(populatedDeal);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET DEALS
export const getDeals = async (req, res) => {
  try {
    const { stage , search} = req.query;

    let filter = {};

    // Owner only show own data 

    if(req.user.role === "sales"){
      filter.owner = req.user.id;
    }

    if (stage) filter.stage = stage;

    if(search){
      filter.$or=[
        {title:{$regex:search, $options :"i"}},
        {organization : {$regex :search , $options : "i"}}
      ]
    }

    const deals = await Deal.find(filter)
      .populate("owner", "name email")
      .populate("lead", "name organization")
      .sort({ createdAt: -1 });

    res.json(deals);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE DEAL
export const updateDeals = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (updateData.products) {
      let totalValue = 0;

      updateData.products = updateData.products.map(item => {
        const base = (item.price || 0) * (item.quantity || 0);
        const taxAmount = (base * (item.tax || 0)) / 100;
        const amount = base + taxAmount;

        totalValue += amount;

        return { ...item, amount };
      });

      updateData.value = totalValue;
    }

    const deal = await Deal.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
      .populate("owner", "name email")
      .populate("lead", "name organization");

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    res.json(deal);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE DEAL
export const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    res.json({ message: "Deal deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// transfer Deals + leads
export const transferDeal  = async (req , res) => {
  try{
    const {newOwnerId} = req.body;

    const deal = await Deal.findById(req.params.id);

    if(!deal){
      return res.status(404).json({message: "Deal not found"});
    }
    if(
      req.user.role !== "Admin" &&
      deal.owner.toString !== req.user.id
    ){
      return res.status(403).json({message : "Not Allowed"});
    }

    deal.owner = newOwnerId;
    await deal.save();

    if (deal.lead) {
    await Leads.findByIdAndUpdate(deal.lead, {
      owner: newOwnerId
    });
    }
    const updateDeal = await Deal.findById(deal._id)
    .populate("owner" , "name , email")
    .populate("lead" , "name , organization");

    res.json(updateDeal);
  }catch(error) {
    res.status(500).json({message :error.message});
  }
};