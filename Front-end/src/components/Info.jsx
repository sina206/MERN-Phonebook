const Info = ({ name, number, id, removePerson }) => {
  return (
    <div>
      <p>
        <b>{name}</b> {number}
        <button type="submit" onClick={removePerson(id)}>
          Delete
        </button>
      </p>
    </div>
  );
};

export default Info;
