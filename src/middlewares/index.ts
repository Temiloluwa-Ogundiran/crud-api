import express from "express";

import { get, merge } from "lodash";

import { getUserBySessionToken } from "../utils/user";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["USER"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });
    return next();
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const isOwner = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as unknown as string;

    if (currentUserId.toString() !== id) {
      return res.sendStatus(400);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
