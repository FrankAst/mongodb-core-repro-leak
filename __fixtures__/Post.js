// @flow
/* eslint-disable no-param-reassign, func-names */

import mongoose from 'mongoose';
import DB from './db';

DB.init();

export const PostSchema = new mongoose.Schema(
  {
    title: String,
  }
);

export const Post = DB.data.model('Post', PostSchema);
