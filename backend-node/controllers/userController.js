import User from "../models/User.js"


export const getAllStudent = async (req, res) => {
  try {
    const students = await User.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(404).send(err.message);
  }
};

export const getuserbyId = async(req,res)=>{
  try{
    const id = req.params.userID;
    const user = await User.findById(id);
    if(!user){
      return res.status(404).send("user not found")
    }
    return res.status(200).json(user)
  }catch(err){
    return res.status(200).send(err.mmessage)
  }
};

export const deleteuserbyId = async(req,res)=>{
  try{
  const id = req.params.userID;
    // First, check if the user exists
    const userExists = await User.findById(id);
    
    if (!userExists) {
      console.log("User not found before deletion attempt for ID:", id);
      return res.status(404).send("User not found");
    }
    // If user exists, then try to delete
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send("User not found after findByIdAndDelete");
    }

    res.status(200).send("User deleted successfully");
  } catch (err) {
    console.error("Error deleting user:", err); // Log the actual error
    res.status(500).send("Server error");
  }
};

export const updateUser = async (req, res) => {
  try {
    console.log("Params:", req.params);
    console.log("Body:", req.body);

    const id = req.params.userID;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found!");
    }

    return res.status(200).json({
      message: "User updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).send("Error updating user");
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete from MongoDB
    await User.findByIdAndDelete(id);

    // Ask Flask to delete face data
    try {
      await axios.delete(`http://127.0.0.1:5000/delete-face/${user.username}`);
      console.log(`✅ Face data deleted for ${user.username}`);
    } catch (flaskErr) {
      console.error("⚠️ Failed to delete face data in Flask:", flaskErr.message);
    }

    res.status(200).json({
      success: true,
      message:` User ${user.username} deleted from DB and face data cleanup attempted.`,
    });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ error: "Server error deleting user." });
  }
};