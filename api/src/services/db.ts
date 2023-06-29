import { PrismaClient } from '@prisma/client';
import { errorLogger } from '../decorators/logger';

const db = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL,
    },
  },
});

export const findUser = async (username: string) => {
  try {
    const user = await db.user.findUnique({
      where: { github_username: username },
    });

    return user;
  } catch (e) {
    errorLogger.log(`Error in db service: ${e.message}`);
    return undefined;
  } finally {
    await db.$disconnect();
  }
};

export const readRepos = async (userId: number) => {
  try {
    const repos = await db.repo.findMany({
      where: { userId },
    });

    return repos;
  } catch (e) {
    errorLogger.log(`Error in db service: ${e.message}`);
    return undefined;
  } finally {
    await db.$disconnect();
  }
};

export const writeUser = async (username: string) => {
  try {
    const userToCreate = await db.user.create({
      data: { github_username: username },
    });

    return userToCreate;
  } catch (e) {
    errorLogger.log(`Error in db service: ${e.message}`);
    return undefined;
  } finally {
    await db.$disconnect();
  }
};

export const writeRepos = async (repos: Repo[], id: number) => {
  try {
    return await db.repo.createMany({
      data: repos.map((repo) => ({
        repo_id: repo.repoId,
        name: repo.name,
        description: repo.description !== null ? repo.description : '',
        stars: repo.stars,
        language: repo.language !== null ? repo.language : '',
        issues: repo.issues,
        url: repo.url,
        created_at: repo.createdAt !== null ? repo.createdAt : '',
        userId: id,
      })),
      skipDuplicates: true,
    });
  } catch (e) {
    errorLogger.log(`Error in db service: ${e.message}`);
    return undefined;
  } finally {
    await db.$disconnect();
  }
};
