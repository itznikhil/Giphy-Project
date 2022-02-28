import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from 'react-native';
// do not forget to add fresco animation to build.gradle
export default function Giphy() {
  const [gifs, setGifs] = useState([]);
  const [searchGifs, setSearchGifs] = useState([]);
  const [term, updateTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  async function fetchGifs() {
    setIsError(false);
    setIsLoading(true);
    try {
      const API_KEY = 'sVCxNfNQ1GL5dJPmHaMlo9JE6pRj0QmN';

      const URL =
        term.length == 0
          ? `http://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${itemsPerPage}&offset=${
              currentPage * itemsPerPage
            }`
          : `http://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&limit=${itemsPerPage}&offset=${
              currentPage * itemsPerPage
            }&q=${term}`;
      const resJson = await fetch(URL);
      const res = await resJson.json();
      setTotalItems(res.pagination.total_count);
      if (term.length > 0) {
        setSearchGifs([...searchGifs, ...res.data]);
      } else if (term.length == 0) {
        setGifs([...gifs, ...res.data]);
      }
    } catch (error) {
      console.warn(error);
      setIsError(true);
      setTimeout(() => setIsError(false), 4000);
    }
    setIsLoading(false);
    setCurrentPage(currentPage + 1);
  } /// add facebook fresco

  function onEdit(newTerm) {
    if (newTerm.length > 0) {
      setSearchGifs([]);

      setCurrentPage(0);

      updateTerm(newTerm);
      fetchGifs();
    } else {
      updateTerm('');
    }
  }
  function footerList() {
    return (
      <View>
        <ActivityIndicator loading={isLoading} size={'large'} />
      </View>
    );
  }

  useEffect(() => {
    fetchGifs();
  }, []);

  return (
    <View style={styles.view}>
      <TextInput
        placeholder="Search Giphy"
        placeholderTextColor="#fff"
        style={styles.textInput}
        onChangeText={text => onEdit(text)}
      />

      <FlatList
        data={term.length > 0 ? searchGifs : gifs}
        renderItem={({item}) => (
          <Image
            resizeMode="contain"
            style={styles.image}
            source={{uri: item.images.fixed_width.url}}
          />
        )}
        onEndReached={fetchGifs}
        ListFooterComponent={footerList}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'darkblue',
  },
  textInput: {
    width: '100%',
    height: 50,
    color: 'white',
  },
  image: {
    width: 300,
    height: 150,
    borderWidth: 3,
    marginBottom: 5,
  },
});
