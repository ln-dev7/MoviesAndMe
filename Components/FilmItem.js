import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Dimensions } from 'react-native'
import { getImageFromApi } from '../API/TMDBApi'
import moment from 'moment'
export default class FilmItem extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      positionLeft: new Animated.Value(Dimensions.get('window').width)
    }
  }

componentDidMount() {
    Animated.spring(
      this.state.positionLeft,
      {
        toValue: 0
      }
    ).start()
  }


  _displayFavoriteImage() {
    if (this.props.isFilmFavorite) {
      // Si la props isFilmFavorite vaut true, on affiche le 🖤
      return (
        <Image
          style={styles.favorite_image}
          source={require('../Images/ic_favorite.png')}
        />
      )
    }
  }

  render() {
    const { film, displayDetailForFilm } = this.props
    return (
      <Animated.View style={{ left: this.state.positionLeft }}> 
          <TouchableOpacity onPress={() => displayDetailForFilm(film.id)} style={styles.main_container}>
            <Image
            style={styles.image}
            source={{uri: getImageFromApi(film.poster_path)}}
            />
            <View style={styles.content_container}>
                <View style={styles.header_container}>
                    {this._displayFavoriteImage()}
                    <Text style={styles.title_text} numberOfLines={2}>{film.title}</Text>
                    <Text style={styles.vote_text}>{film.vote_average}</Text>
                </View>
                <View style={styles.description_container}>
                    <Text style={styles.description_text} numberOfLines={7}>{film.overview}</Text>
                    {/* La propriété numberOfLines permet de couper un texte si celui-ci est trop long, il suffit de définir un nombre maximum de ligne */}
                </View>
                <View style={styles.date_container}>
                    <Text style={styles.date_text}>Sorti le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                </View>
            </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
    main_container: {
      height: 190,
      flexDirection: 'row'
    },
    image: {
      width: 120,
      height: 180,
      margin: 5,
      backgroundColor: 'gray'
    },
    favorite_image: {
      width: 25,
      height: 25,
      margin: 5,
      backgroundColor: '#E50914'
    },
    content_container: {
      flex: 1,
      margin: 5
    },
    header_container: {
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center'
    },
    title_text: {
      fontWeight: 'bold',
      fontSize: 17,
      color: '#fff',
      flex: 1,
      flexWrap: 'wrap',
      padding: 5,
    },
    vote_text: {
      fontWeight: 'bold',
      fontSize: 22,
      color: '#E50914'
    },
    description_container: {
      flex: 7,
      overflow: 'hidden'
    },
    description_text: {
      fontStyle: 'italic',
      color: '#666666'
    },
    date_container: {
      flex: 1
    },
    date_text: {
      textAlign: 'right',
      fontSize: 14,
      color: '#fff'
    }
  })