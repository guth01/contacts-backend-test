const asyncHandler=require("express-async-handler");
const Contact=require("../models/contactModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access private

const getContacts=asyncHandler(async(req,res)=>{
    const contacts=await Contact.find({user_id:req.user.id});
    res.status(200).json(contacts);
});
//@desc Create New contacts
//@route POST /api/contacts
//@access private
const createContact=asyncHandler(async(req,res)=>{
    console.log("the req body is",req.body);
    const {name,email,phone}=req.body;
    if(!name||!email||!phone){
        res.status(400);
        throw new Error("all fields are mandatory");
    }
    const contact=await Contact.create({
        name,
        email,
        phone,
        user_id:req.user.id
    });
    res.status(201).json(contact);
});
//@desc get contact
//@route GET /api/contacts
//@access private
const getContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found")
    }
    res.status(200).json(contact);
});

//@desc Update contact
//@route PUT /api/contacts
//@access private
const updateContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found")
    }

    if(contact.user_id.toString()!==req.user.id){
        res.status(403);
        throw new Error("cant update another user");
    }
    const updated=await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.status(200).json(updated);
});


//@desc Delete contact
//@route DELETE /api/contacts
//@access private
const deleteContact=asyncHandler(async(req,res)=>{
    const contact=await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("contact not found")
    }
    if(contact.user_id.toString()!==req.user.id){
        res.status(403);
        throw new Error("cant update another user");
    }
    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json(contact);
});
module.exports={getContacts,createContact,getContact,updateContact,deleteContact};