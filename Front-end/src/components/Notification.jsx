const Notification = ({ message, error }) => {
  const notificationStyle = {
    color: error ? "red" : "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  if (message === null) {
    return null;
  }
  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;
