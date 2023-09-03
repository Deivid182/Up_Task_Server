import User from "../models/User.js";
import { makeId } from "../helpers/makeId.js";
import { makeJWT } from "../helpers/makeJWT.js";
import { emailForgotPassword, emailSignUp } from "../helpers/email.js";

export const newUser = async (req, res) => {
  const { email } = req.body;
  const thereIsUser = await User.findOne({ email });

  if (thereIsUser) {
    const error = new Error("Account already in use");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    user.token = makeId();  
    await user.save();

    emailSignUp({
      email: user.email,
      name: user.name,
      token: user.token
    })

    res.json({msg: "Thanks for signing up. Check your email for a link to verify your email address"});
  } catch (error) {
    console.log(error);
  }
};

export const authenticate = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Account does not exist");
    return res.status(404).json({ msg: error.message });
  }

  if (!user.confirmed) {
    const error = new Error(
      "Your account have not been confirmed. Try and come back"
    );
    return res.status(403).json({ msg: error.message });
  }

  if (await user.comparePassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: makeJWT(user._id),
    });
  } else {
    const error = new Error(
      "Either your email or your password is incorrect. Try again"
    );
    return res.status(403).json({ msg: error.message });
  }
};

export const confirm = async (req, res) => {
  const { token } = req.params;
  const userConfirm = await User.findOne({ token });

  if (!userConfirm) {
    const error = new Error("Invalid token. Try again");
    return res.status(403).json({ msg: error.message });
  }

  try {
    //console.log(userConfirm)
    userConfirm.confirmed = true;
    userConfirm.token = null;
    await userConfirm.save();
    res.json({ msg: "Your account has been confirmed successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (req, res) => {
  //console.log("From forgot password")
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Email address not founded");
    res.status(404).json({ message: error.message });
  }

  try {
    user.token = makeId();
    await user.save();
    emailForgotPassword({
      email: user.email,
      name: user.name,
      token: user.token
    })
    res.json({
      msg: "We've sent you an email with instructions so that you can restore your password",
    });
  } catch (error) {
    console.log(error);
  }
};

export const checkToken = async (req, res) => {
  const { token } = req.params;

  const validToken = await User.findOne({ token });
  if (validToken) {
    res.json({ msg: "Valid Token" });
  } else {
    const error = new Error("Invalid token");
    res.status(404).json({ msg: error.message });
  }
};

export const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });
  //console.log(user, password)
  
  if (user) {
    user.password = password
    user.token = null
    try {
      await user.save()
      res.json({msg: "Your password has been changed succesfully"})      
    } catch (error) {
      console.log(error)
    }
  } else {
    const error = new Error("Invalid token");
    res.status(404).json({ msg: error.message });
  }
};

export const profile = async(req, res) =>{
  const { user } = req
  res.json(user)
}

export const updateProfile = async(req, res) =>{
  const { id } = req.params;
  const { name, email, newPassword, currentPassword } = req.body; 

  const user = await User.findById(id)

  if(!user) return res.status(404).json({ message: 'User not found'})

  if(req.user.email !== email) {
    const existsEmail = await User.findOne({ email })
    if(existsEmail) return res.status(400).json({ message: 'Email already exists'}) 
  }

  if(currentPassword){
    const isCorrectPassword = await user.comparePassword(currentPassword)
    if(!isCorrectPassword) {
      return res.status(400).json({ message: 'Invalid password'})
    } else {
      user.password = newPassword
    }
  }

  try {
    user.name = name || user.name;
    user.email = email ||  user.email;
  
    await user.save()
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const updatePassword = async(req, res) =>{
  const { currentPassword, newPassword } = req.body;

  const { _id } = req.user
  const user = await User.findById(_id)

  if(!user) return res.status(404).json({ message: 'User not found'})

  if(await user.comparePassword(currentPassword)) {
      user.password = newPassword;
      await user.save()
      return res.status(200).json({ message: 'Password changed' })
  } else {
    return res.status(400).json({ message: 'Invalid password' })
  }
}