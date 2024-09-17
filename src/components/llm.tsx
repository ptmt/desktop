async function askAgent(prompt: string) {
  await window.electronWindow.agent(prompt);
}

export default askAgent;
