import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import axios from "axios";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNumber] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    personService.getAll().then((persons) => {
      setPersons(persons);
    });
  }, []);

  const addName = (e) => {
    e.preventDefault();

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    if (persons.some((person) => person.name === newPerson.name)) {
      if (
        window.confirm(
          `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const targetPerson = persons.find(persons.name === newPerson.name);
        const id = targetPerson.id;
        personService.update(newPerson, id).then((updated) => {
          setPersons(
            persons.map((person) => (person.id !== id ? person : updated))
          );
        });
      }
    } else {
      personService.create(newPerson).then((person) => {
        setPersons(persons.concat(person));
      });
    }
    setNewName("");
    setNumber("");
  };
  const handleDeletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.deletePerson(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  const filter = searchName
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(searchName.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchName={searchName} setSearchName={setSearchName} />

      <h2>Add a new</h2>
      <PersonForm
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        setNumber={setNumber}
        setNewName={setNewName}
      />
      <h2>Numbers</h2>
      <Persons filter={filter} handleDeletePerson={handleDeletePerson} />
    </div>
  );
};

export default App;
