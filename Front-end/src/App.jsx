import { useState, useEffect } from "react";
import personService from "./services/persons";
import Info from "./components/Info";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [addedMessage, setAddedMessage] = useState(null);
  const [errorStatus, setErrorStatus] = useState(false);

  const hook = () => {
    personService.getAll().then((response) => {
      setPersons(response);
    });
  };
  useEffect(hook, []);

  const addPerson = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
    };

    for (let i = 0; i < persons.length; i++) {
      if (
        JSON.stringify(personObject.name) === JSON.stringify(persons[i].name)
      ) {
        if (
          window.confirm(`${personObject.name} is already in your phonebook,
          replace the old number with a new one?`)
        ) {
          personService
            .update(persons[i].id, personObject)
            .then(() => {
              personService.getAll().then((response) => {
                setPersons(response);
                setNewName("");
                setNewNumber("");
              });
            })
            .catch((error) => {
              if (error.response.status === 400) {
                displayNotification(error.response.data.error, true);
                return;
              }
              displayNotification(
                `Information of ${personObject.name} has already been removed`,
                true
              );
            });
        }
        return;
      }
    }

    personService
      .create(personObject)
      .then((response) => {
        setPersons(persons.concat(response));
        setNewName("");
        setNewNumber("");
        displayNotification(`Added ${personObject.name}`);
      })
      .catch((error) => displayNotification(error.response.data.error, true));
  };

  const removePerson = (id) => () => {
    if (window.confirm("Are you sure you would like to delete this person?")) {
      remove(id).then(() => {
        personService.getAll().then((response) => {
          setPersons(response);
        });
      });
    }
  };

  const displayNotification = (message, error) => {
    if (error === true) {
      setErrorStatus(true);
    }
    setAddedMessage(`${message}`);
    setTimeout(() => {
      setAddedMessage(null);
      setErrorStatus(false);
    }, 5000);
  };

  const remove = (id) => {
    return personService.del(id);
  };

  const handlePersonsChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchName(event.target.value);
  };

  const namesToShow =
    searchName === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(searchName.toLowerCase())
        );

  return (
    <div>
      <Notification message={addedMessage} error={errorStatus} />
      <p>
        Search <input value={searchName} onChange={handleSearch} />
      </p>
      <h2>Phonebook</h2>
      <form onSubmit={addPerson}>
        <p>
          name: <input value={newName} onChange={handlePersonsChange} />
        </p>
        <p>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </p>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {namesToShow.map((person) => (
          <Info
            key={person.id}
            name={person.name}
            number={person.number}
            id={person.id}
            removePerson={removePerson}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
