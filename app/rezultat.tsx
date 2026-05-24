import {Ionicons} from '@expo/vector-icons';
import {useLocalSearchParams,useRouter} from 'expo-router';
import {ScrollView,StyleSheet,Text,TouchableOpacity,View} from 'react-native';

type Round = {
  id: number;
  mi: number;
  vi: number;
};

export default function RezultatScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    rounds?: string;
    targetScore?: string;
    gamesMi?: string;
    gamesVi?: string;
  }>();

  const rounds: Round[] = params.rounds ? JSON.parse(params.rounds) : [];
  const targetScore = Number(params.targetScore || 1001);
  const gamesMi = Number(params.gamesMi || 0);
  const gamesVi = Number(params.gamesVi || 0);

  const totalMi = rounds.reduce((sum, round) => sum + round.mi, 0);
  const totalVi = rounds.reduce((sum, round) => sum + round.vi, 0);

  const hasWinner = totalMi >= targetScore || totalVi >= targetScore;

  let displayedRounds = rounds;
  let displayedTotalMi = totalMi;
  let displayedTotalVi = totalVi;
  let displayedGamesMi = gamesMi;
  let displayedGamesVi = gamesVi;

  if (hasWinner) {
    if (totalMi >= targetScore && totalMi >= totalVi) {
      displayedGamesMi = gamesMi + 1;
    } else if (totalVi >= targetScore && totalVi > totalMi) {
      displayedGamesVi = gamesVi + 1;
    }

    displayedRounds = [];
    displayedTotalMi = 0;
    displayedTotalVi = 0;
  }

  const goToInput = () => {
    router.push({
      pathname: '/unos',
      params: {
        rounds: JSON.stringify(displayedRounds),
        targetScore: String(targetScore),
        gamesMi: String(displayedGamesMi),
        gamesVi: String(displayedGamesVi),
      },
    });
  };

  const goToSettings = () => {
    router.push({
      pathname: '/postavke',
      params: {
        rounds: JSON.stringify(displayedRounds),
        targetScore: String(targetScore),
        gamesMi: String(displayedGamesMi),
        gamesVi: String(displayedGamesVi),
      },
    });
  };

  const newGame = () => {
    router.replace({
      pathname: '/rezultat',
      params: {
        rounds: JSON.stringify([]),
        targetScore: String(targetScore),
        gamesMi: String(0),
        gamesVi: String(0),
      },
    });
  };

  if (hasWinner) {
    setTimeout(() => {
      router.replace({
        pathname: '/rezultat',
        params: {
          rounds: JSON.stringify([]),
          targetScore: String(targetScore),
          gamesMi: String(displayedGamesMi),
          gamesVi: String(displayedGamesVi),
        },
      });
    }, 0);
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goToSettings}>
          <Ionicons name="settings-outline" size={26} color="#334030" />
        </TouchableOpacity>
      </View>

      <View style={styles.gameScoreRow}>
        <View style={styles.gameScoreBox}>
          <Text style={styles.gameScoreLabel}>MI</Text>
          <Text style={styles.gameScoreValue}>{displayedGamesMi}</Text>
        </View>

        <Text style={styles.gameScoreSeparator}>:</Text>

        <View style={styles.gameScoreBox}>
          <Text style={styles.gameScoreLabel}>VI</Text>
          <Text style={styles.gameScoreValue}>{displayedGamesVi}</Text>
        </View>
      </View>

      <View style={styles.scoreCard}>
        <View style={styles.team}>
          <Text style={styles.score}>{displayedTotalMi}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.team}>
          <Text style={styles.score}>{displayedTotalVi}</Text>
        </View>
      </View>

      <Text style={styles.targetText}>Igra do {targetScore}</Text>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>MI</Text>
          <Text style={styles.headerCell}>VI</Text>
        </View>

        <ScrollView>
          {displayedRounds.map(round => (
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

  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 18,
    paddingHorizontal: 20,
  },

  gameScoreRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
  },

  gameScoreBox: {
    alignItems: 'center',
    minWidth: 52,
  },

  gameScoreLabel: {
    color: '#334030',
    fontSize: 12,
    fontWeight: '500',
  },

  gameScoreValue: {
    color: '#334030',
    fontSize: 22,
    fontWeight: '700',
  },

  gameScoreSeparator: {
    color: '#334030',
    fontSize: 22,
    fontWeight: '600',
    marginHorizontal: 8,
    marginTop: 12,
  },

  scoreCard: {
    backgroundColor: 'rgba(183,213,175,0.55)',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 25,
  },

  team: {
    alignItems: 'center',
    flex: 1,
  },

  score: {
    fontSize: 40,
    color: '#334030',
    fontWeight: '600',
  },

  divider: {
    width: 1,
    height: 60,
    backgroundColor: '#6F8F68',
  },

  targetText: {
    textAlign: 'center',
    color: '#334030',
    fontSize: 14,
    marginBottom: 10,
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