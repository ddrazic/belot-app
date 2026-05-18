import {useLocalSearchParams,useRouter} from 'expo-router';
import {ScrollView,StyleSheet,Text,TouchableOpacity,View} from 'react-native';

type Round = {
  id: number;
  mi: number;
  vi: number;
};

export default function RezultatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ rounds?: string }>();

  const rounds: Round[] = params.rounds ? JSON.parse(params.rounds) : [];

  const totalMi = rounds.reduce((sum, round) => sum + round.mi, 0);
  const totalVi = rounds.reduce((sum, round) => sum + round.vi, 0);

  const goToInput = () => {
    router.push({
      pathname: '/unos',
      params: {
        rounds: JSON.stringify(rounds),
      },
    });
  };

  const newGame = () => {
    router.replace({
      pathname: '/rezultat',
      params: {
        rounds: JSON.stringify([]),
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.scoreCard}>
        <View style={styles.team}>
          <Text style={styles.label}>MI</Text>
          <Text style={styles.score}>{totalMi}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.team}>
          <Text style={styles.label}>VI</Text>
          <Text style={styles.score}>{totalVi}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>MI</Text>
          <Text style={styles.headerCell}>VI</Text>
        </View>

        <ScrollView>
          {rounds.map(round => (
            <View key={round.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{round.mi}</Text>
              <Text style={styles.tableCell}>{round.vi}</Text>
            </View>
          ))}
        </ScrollView>

      </View>

      <TouchableOpacity style={styles.addButton} onPress={goToInput}>
        <Text style={styles.addText}>+ NOVI UNOS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.newGame} onPress={newGame}>
        <Text style={styles.newGameText}>NOVA IGRA</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  scoreCard: {
    backgroundColor: 'rgba(183,213,175,0.55)',
    margin: 20,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 25,
  },

  team: {
    alignItems: 'center',
    flex: 1,
  },

  label: {
    color: '#334030',
    fontSize: 16,
    padding: 5,
  },

  score: {
    fontSize: 40,
    color: '#334030',
    fontWeight: '600',
  },

  divider: {
    width: 1,
    backgroundColor: '#6F8F68',
  },

  table: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 10,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#B7D5AF',
    paddingVertical: 10,
  },

  headerCell: {
    flex: 1,
    textAlign: 'center',
    color: '#334030',
    fontSize: 18,
    fontWeight: '700',
  },

  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(111,143,104,0.25)',
    paddingVertical: 10,
  },

  tableCell: {
    flex: 1,
    textAlign: 'center',
    color: '#334030',
    fontSize: 20,
  },

  addButton: {
    backgroundColor: '#6F8F68',
    padding: 25,
    alignItems: 'center',
  },

  addText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
  },

  newGame: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6F8F68',
    backgroundColor: '#fff',
  },

  newGameText: {
    color: '#334030',
    fontWeight: '500',
  },
});