const handleKeyDown = (event, handleLogin) => {
  if (event.key === "Enter" || event.keyCode === 13) {
    handleLogin();
  }
};

export default handleKeyDown;
