import {useLocalSearchParams,useRouter} from 'expo-router';
import React,{useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Team = 'mi' | 'vi';

type Round = {
  id: number;
  mi: number;
  vi: number;
};

const PRIMARY = '#B7D5AF';
const PRIMARY_55 = 'rgba(183,213,175,0.55)';
const DARK = '#6F8F68';
const TEXT = '#334030';
const BG = '#F5F5F5';
const WHITE = '#FFFFFF';

const ZVANJA = [20, 50, 100, 150, 200];

export default function UnosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ rounds?: string }>();

  const rounds: Round[] = params.rounds ? JSON.parse(params.rounds) : [];

  const [activeTeam, setActiveTeam] = useState<Team>('mi');
  const [calledTeam, setCalledTeam] = useState<Team | null>(null);

  const [mi, setMi] = useState('');
  const [vi, setVi] = useState('');

  const [zvanjaMi, setZvanjaMi] = useState<number[]>([]);
  const [zvanjaVi, setZvanjaVi] = useState<number[]>([]);
  const [stigljaTeam, setStigljaTeam] = useState<Team | null>(null);

  const baseMi = Number(mi || 0);
  const baseVi = Number(vi || 0);

  const sumZvanjaMi = zvanjaMi.reduce((sum, value) => sum + value, 0);
  const sumZvanjaVi = zvanjaVi.reduce((sum, value) => sum + value, 0);

  const totalMi = baseMi + sumZvanjaMi + (stigljaTeam === 'mi' ? 90 : 0);
  const totalVi = baseVi + sumZvanjaVi + (stigljaTeam === 'vi' ? 90 : 0);

  const ukupnaIgra = 162 + sumZvanjaMi + sumZvanjaVi + (stigljaTeam ? 90 : 0);
  const pragProlaza = Math.floor(ukupnaIgra / 2) + 1;

  const currentValue = activeTeam === 'mi' ? mi : vi;

  const addDigit = (digit: string) => {
    const next = currentValue + digit;
    if (next.length > 3) return;

    const nextNumber = Number(next);
    if (nextNumber > 162) return;

    if (activeTeam === 'mi') {
      setMi(next);
      setVi(String(162 - nextNumber));
    } else {
      setVi(next);
      setMi(String(162 - nextNumber));
    }
  };

  const removeDigit = () => {
    const next = currentValue.slice(0, -1);
    const nextNumber = Number(next || 0);

    if (activeTeam === 'mi') {
      setMi(next);
      setVi(next === '' ? '' : String(162 - nextNumber));
    } else {
      setVi(next);
      setMi(next === '' ? '' : String(162 - nextNumber));
    }
  };

  const toggleZvanje = (value: number) => {
    if (activeTeam === 'mi') {
      setZvanjaMi(prev =>
        prev.includes(value)
          ? prev.filter(item => item !== value)
          : [...prev, value]
      );
    } else {
      setZvanjaVi(prev =>
        prev.includes(value)
          ? prev.filter(item => item !== value)
          : [...prev, value]
      );
    }
  };

  const toggleStiglja = () => {
    setStigljaTeam(prev => (prev === activeTeam ? null : activeTeam));
  };

  const handleCancel = () => {
    setMi('');
    setVi('');
    setZvanjaMi([]);
    setZvanjaVi([]);
    setStigljaTeam(null);
    setCalledTeam(null);
  };

  const handleSubmit = () => {
    if (!calledTeam) {
      Alert.alert('Nedostaje podatak', 'Odaberi tko je zvao adut.');
      return;
    }

    if (baseMi + baseVi !== 162) {
      Alert.alert(
        'Neispravan unos',
        'Zbroj osnovnih bodova za MI i VI mora biti 162.'
      );
      return;
    }

    if (baseMi === 0 && sumZvanjaMi > 0) {
      Alert.alert(
        'Neispravan unos',
        'Zvanja se ne priznaju ekipi MI jer nije osvojila nijedan štih.'
      );
      return;
    }

    if (baseVi === 0 && sumZvanjaVi > 0) {
      Alert.alert(
        'Neispravan unos',
        'Zvanja se ne priznaju ekipi VI jer nije osvojila nijedan štih.'
      );
      return;
    }

    const calledScore = calledTeam === 'mi' ? totalMi : totalVi;

    let finalMi = totalMi;
    let finalVi = totalVi;

    if (calledScore < pragProlaza) {
      if (calledTeam === 'mi') {
        finalMi = 0;
        finalVi = ukupnaIgra;
      } else {
        finalMi = ukupnaIgra;
        finalVi = 0;
      }
    }

    const newRound: Round = {
      id: rounds.length + 1,
      mi: finalMi,
      vi: finalVi,
    };

    router.replace({
      pathname: '/rezultat',
      params: {
        rounds: JSON.stringify([...rounds, newRound]),
      },
    });
  };

  const activeZvanja = activeTeam === 'mi' ? zvanjaMi : zvanjaVi;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.teamRow}>
          <TouchableOpacity
            style={[
              styles.teamCard,
              activeTeam === 'mi' && styles.activeTeamCard,
            ]}
            onPress={() => setActiveTeam('mi')}
          >
            <Text style={styles.teamTitle}>MI</Text>
            {totalMi > 0 && <Text style={styles.teamScore}>{totalMi}</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.teamCard,
              activeTeam === 'vi' && styles.activeTeamCard,
            ]}
            onPress={() => setActiveTeam('vi')}
          >
            <Text style={styles.teamTitle}>VI</Text>
            {totalVi > 0 && <Text style={styles.teamScore}>{totalVi}</Text>}
          </TouchableOpacity>
        </View>

        <View style={styles.calledSection}>
          <Text style={styles.calledLabel}>Zvali adut</Text>

          <View style={styles.calledRow}>
            <TouchableOpacity
              style={[
                styles.calledButton,
                calledTeam === 'mi' && styles.calledButtonActive,
              ]}
              onPress={() => setCalledTeam('mi')}
            >
              <Text
                style={[
                  styles.calledText,
                  calledTeam === 'mi' && styles.calledTextActive,
                ]}
              >
                MI
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.calledButton,
                calledTeam === 'vi' && styles.calledButtonActive,
              ]}
              onPress={() => setCalledTeam('vi')}
            >
              <Text
                style={[
                  styles.calledText,
                  calledTeam === 'vi' && styles.calledTextActive,
                ]}
              >
                VI
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.zvanjaGrid}>
          {ZVANJA.map(value => (
            <TouchableOpacity
              key={value}
              style={styles.zvanjeButton}
              onPress={() => toggleZvanje(value)}
            >
              <Text
                style={[
                  styles.zvanjeText,
                  activeZvanja.includes(value) && styles.selected,
                ]}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.zvanjeButton} onPress={toggleStiglja}>
            <Text
              style={[
                styles.zvanjeText,
                stigljaTeam === activeTeam && styles.selected,
              ]}
            >
              štiglja
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        <View style={styles.keypad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', ''].map(
            (item, index) => {
              if (item === '') {
                return <View key={`empty-${index}`} style={styles.key} />;
              }

              return (
                <TouchableOpacity
                  key={`${item}-${index}`}
                  style={styles.key}
                  onPress={() =>
                    item === '<' ? removeDigit() : addDigit(item)
                  }
                >
                  <Text style={styles.keyText}>{item}</Text>
                </TouchableOpacity>
              );
            }
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>OBRIŠI</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>UNESI</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  backButton: {
    paddingTop: 14,
    paddingLeft: 22,
    paddingBottom: 8,
  },

  back: {
    fontSize: 28,
    color: TEXT,
  },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 6,
  },

  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  teamCard: {
    width: '48%',
    height: 78,
    backgroundColor: PRIMARY_55,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeTeamCard: {
    borderWidth: 2,
    borderColor: DARK,
  },

  teamTitle: {
    fontSize: 19,
    color: TEXT,
    fontWeight: '500',
  },

  teamScore: {
    fontSize: 28,
    color: TEXT,
    fontWeight: '700',
  },

  calledSection: {
    marginTop: 18,
    alignItems: 'center',
  },

  calledLabel: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 7,
  },

  calledRow: {
    flexDirection: 'row',
    gap: 12,
  },

  calledButton: {
    minWidth: 58,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: PRIMARY_55,
    alignItems: 'center',
  },

  calledButtonActive: {
    backgroundColor: PRIMARY,
    borderWidth: 1,
    borderColor: DARK,
  },

  calledText: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '600',
  },

  calledTextActive: {
    fontWeight: '900',
  },

  zvanjaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 18,
    marginBottom: 18,
  },

  zvanjeButton: {
    width: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
  },

  zvanjeText: {
    fontSize: 20,
    color: TEXT,
    fontWeight: '600',
    textAlign: 'center',
  },

  selected: {
    fontWeight: '900',
  },

  separator: {
    height: 1,
    backgroundColor: PRIMARY_55,
    marginBottom: 22,
  },

  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
  },

  key: {
    width: '30%',
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  keyText: {
    color: DARK,
    fontSize: 32,
    fontWeight: '500',
  },

  footer: {
    height: 82,
    flexDirection: 'row',
  },

  cancelButton: {
    width: '39%',
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },

  submitButton: {
    width: '61%',
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelText: {
    color: DARK,
    fontSize: 16,
    fontWeight: '700',
  },

  submitText: {
    color: WHITE,
    fontSize: 17,
    fontWeight: '700',
  },
});