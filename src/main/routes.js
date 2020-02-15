import { app } from "electron";
import Config from "./Config";
import ipc from "./ipc";
import run from "./run";
import Project from "./Database/entity/Project";
import Command from "./Database/entity/Command";

export default function(connection) {
  const projectRepo = connection.getRepository(Project);
  const commandRepo = connection.getRepository(Command);

  ipc.answerRenderer("get:config", () => {
    return Config.config;
  });

  ipc.answerRenderer("post:config", async config => {
    Config.update(config);
    await Config.saveConfig();
    return Config.config;
  });

  ipc.answerRenderer("get:projects", async () => {
    return await projectRepo.find();
  });

  ipc.answerRenderer("put:project", async project => {
    return await projectRepo.save(project);
  });

  ipc.answerRenderer("put:project/clone", async ({ title, id }) => {
    const commands = await commandRepo.find({ project: id });
    console.log(commands);
    return await projectRepo.save({ title });
  });

  ipc.answerRenderer("get:project", async id => {
    return await projectRepo.findOne(id);
  });

  ipc.answerRenderer("post:project", async project => {
    await projectRepo.update(project.id, project);
    return projectRepo.findOne(project.id);
  });

  ipc.answerRenderer("delete:project", async id => {
    await commandRepo.delete({ project: id });
    return await projectRepo.delete(id);
  });

  ipc.answerRenderer("get:command", async id => {
    return await commandRepo.findOne(id);
  });

  ipc.answerRenderer("get:commands", async projectId => {
    return await commandRepo.find({ project: projectId });
  });

  ipc.answerRenderer("delete:command", async id => {
    return await commandRepo.delete(id);
  });

  ipc.answerRenderer("put:command", async command => {
    return await commandRepo.save(command);
  });

  ipc.answerRenderer("post:command", async command => {
    await commandRepo.update(command.id, command);
    return commandRepo.findOne(command.id);
  });

  ipc.answerRenderer("post:command/run", async args => {
    return await run(args);
  });

  ipc.answerRenderer("post:relaunch", () => {
    app.relaunch();
    app.quit();
    return {};
  });
}
