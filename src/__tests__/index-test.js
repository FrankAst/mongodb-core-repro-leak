import mongoose from 'mongoose';
import DB from '../../__fixtures__/db';
import { Post } from '../../__fixtures__/Post';

jest.mock('../../__fixtures__/db.js');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

describe('Leaking suite', () => {
  DB.init();
  it('create Post', async () => {
    const post = await Post.create({title: 'lorem ipsum'});
    expect(post.title).toBe('lorem ipsum');
  });
});