import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity, Text, Modal, Pressable, TextInput, Image, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';


function App() {
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [listingModalVisible, setListingModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [listings, setListings] = useState([]);
  const [expandedItemIndex, setExpandedItemIndex] = useState(null);

  const handleFilterPress = () => setFilterModalVisible(true);
  const handleCloseFilterModal = () => setFilterModalVisible(false);
  const handleCreateListingPress = () => setListingModalVisible(true);
  const handleCloseListingModal = () => setListingModalVisible(false);

  const handleImagePress = () => {
    launchImageLibrary({}, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleCameraPress = () => {
    launchCamera({}, response => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleAddListing = (listing) => {
    setListings([...listings, listing]);
    setListingModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
     
      <View style={styles.topButtons}>
        <TouchableOpacity style={styles.button} onPress={handleFilterPress}>
          <Icon name="filter-list" size={30} color="#000" />
          <Text style={styles.buttonText}>Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCreateListingPress}>
          <Icon name="list" size={30} color="#000" />
          <Text style={styles.buttonText}>List Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => alert('Your Listings pressed')}>
          <Icon name="folder" size={30} color="#000" />
          <Text style={styles.buttonText}>Your Listings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => alert('Chats pressed')}>
          <Icon name="chat" size={30} color="#000" />
          <Text style={styles.buttonText}>Chats</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => setExpandedItemIndex(expandedItemIndex === index ? null : index)}>
            <View style={styles.listItem}>
              <Text style={styles.listingText}>{item.name}</Text>
              <Text style={styles.listingText}>{item.meetupLocation}</Text>
              {item.imageUri && <Image source={{ uri: item.imageUri }} style={styles.previewImage} />}
              {expandedItemIndex === index && (
                <>
                  <Text style={styles.listingText}>{item.description}</Text>
                  <Text style={styles.listingText}>{item.itemWorth}</Text>
                  <Text style={styles.listingText}>{item.name}</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      

      <FilterModal visible={filterModalVisible} onClose={handleCloseFilterModal} />
      <ListingModal
        visible={listingModalVisible}
        onClose={handleCloseListingModal}
        imageUri={imageUri}
        onImagePress={handleImagePress}
        onCameraPress={handleCameraPress}
        onSubmit={handleAddListing}
      />
    </SafeAreaView>
  );
}

function FilterModal({ visible, onClose }) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.filterModalContent}>
          <Text style={styles.modalTitle}>Filter Options</Text>
          <Pressable style={styles.optionButton} onPress={() => alert('Item Worth pressed')}>
            <Text style={styles.optionText}>Item Worth</Text>
          </Pressable>
          <Pressable style={styles.optionButton} onPress={() => alert('Category pressed')}>
            <Text style={styles.optionText}>Category</Text>
          </Pressable>
          <Pressable style={styles.optionButton} onPress={() => alert('Distance pressed')}>
            <Text style={styles.optionText}>Distance</Text>
          </Pressable>
          <Pressable style={styles.updateButton} onPress={onClose}>
            <Text style={styles.updateButtonText}>Update</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

import { ScrollView } from 'react-native';

function ListingModal({ visible, onClose, imageUri, onImagePress, onCameraPress, onSubmit }) {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [itemWorth, setItemWorth] = useState('');
  const [meetupLocation, setMeetupLocation] = useState('');
  const [description, setDescription] = useState('');

  const handlePressSubmit = () => {
    if (!title || !name || !itemWorth || !meetupLocation || !description) {
      alert('Please fill out all the fields before submitting.');
      return;
    }

    const newListing = {
      title,
      name,
      itemWorth,
      meetupLocation,
      description,
      imageUri
    };
    onSubmit(newListing);
    setTitle('');
    setName('');
    setItemWorth('');
    setMeetupLocation('');
    setDescription('');
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Text style={styles.modalTitle}>Create Listing</Text>

{/*Title box*/}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Item title:</Text>
              <TextInput
                style={styles.input}
                //placeholder="Title"
                placeholderTextColor="#000"
                value={title}
                onChangeText={setTitle}
              />
            </View>

{/*Name box*/}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Your name:</Text>   
              <TextInput // the above line is for the name of the box
                style={styles.input}
                //placeholder="Name"
                placeholderTextColor="#000"
                value={name}
                onChangeText={setName}
              />
            </View>

{/*worth box*/}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Worth($):</Text>
              <TextInput
                style={styles.input}
                //placeholder="Worth"
                keyboardType="numeric"
                placeholderTextColor="#000"
                value={itemWorth}
                onChangeText={setItemWorth}
              />
            </View>

 {/* location box*/}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Location:</Text>
              <TextInput
                style={styles.input}
                //placeholder="Location"
                placeholderTextColor="#000"
                value={meetupLocation}
                onChangeText={setMeetupLocation}
              />
            </View>

{/*description box of the jsx or java script xml*/}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Description:</Text>
              <TextInput
                style={[styles.input, { height: 80 }]}
                //placeholder="Description"  //the text inside box that disappear
                multiline
                placeholderTextColor="#000"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <Pressable style={styles.optionButton} onPress={onImagePress}>
              <Text style={styles.optionText}>Pick Image</Text>
            </Pressable>
            <Pressable style={styles.optionButton} onPress={onCameraPress}>
              <Text style={styles.optionText}>Take Picture</Text>
            </Pressable>

            {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}

            <Pressable style={styles.updateButton} onPress={handlePressSubmit}>
              <Text style={styles.updateButtonText}>Submit</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  container: {    //whole screen   
    flex: 1, //whole screen
    padding: 16,  //the space from top to the logo
    backgroundColor: '#F3F4F6', // Tesla white background
  },
  logo: {
    width: 200,
    height: 50,
    alignSelf: 'center',
    marginBottom: 10,
  },
  topButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    marginTop: 5,  //setting space
    fontSize: 14,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterModalContent: {
    width: 300,
    height: 200, // Adjusted height for FilterModal
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  modalContent: {
    width: 300,  //the size of the screen when in listing item
    height: 500,
    backgroundColor: '#fff',
    borderRadius: 10,   //to make the listing modal edge curve or just sharp
    padding: 10,//the bottom part of the white part in listing
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 10,
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 5, //the gap between worth and location, name title...
  },
  label: {
    fontSize: 10,  //the size of title, Name, wroth, location the words
    color: '#000',
    marginBottom: 5,
  },
  input: {
    width: '100%', // Full width
    height: 40, // Reduced height
    paddingHorizontal: 50, // Horizontal padding for content inside the field
    paddingVertical: 5, // Vertical padding for content inside the field
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#000', // Ensure text color is set to black
  },
  optionButton: {
    marginBottom: 5,
    padding: 10, // Reduced the padding
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  
  optionText: {    //pick image and take picture words
    fontSize: 10,
    color: '#000',
  },
  updateButton: {
    marginTop: 2,  //the bottom white part gap
    padding: 5,  //size of submit background color
    backgroundColor: '#007BFF',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,  //submit button
  },
  bottomButton: {
    position: 'absolute',
    left: 16,
    bottom: 16,
  },
  listItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  listingText: {
    fontSize: 14,  //after listed the title of the item size
    color: '#000',
  },
  previewImage: {    //the image preview after you select
    width: 100,
    height: 100,
    marginTop: 10,
  },
});


export default App;