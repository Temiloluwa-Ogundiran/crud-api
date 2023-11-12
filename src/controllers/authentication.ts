import express from "express";

import { getUserByEmail, createUser } from "../utils/user";
import { random, authentication } from "../utils/authentication";

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).send("User already exist, change user");
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user || !user.authentication) {
      return res.status(400).send("user not found");
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (expectedHash !== user.authentication.password) {
      return res.status(403).send("Incorrect password");
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();
    res.cookie("USER", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
};
