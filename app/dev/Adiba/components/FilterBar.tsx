import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../constants/colors";

interface FilterBarProps {
  filters: string[];
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, selectedFilter, onSelectFilter }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterButton, 
            selectedFilter === filter && styles.selectedFilter
          ]}
          onPress={() => onSelectFilter(filter)}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.filterText, 
            selectedFilter === filter && styles.selectedText
          ]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingVertical: 16,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: colors.platinum2,
    borderWidth: 2,
    borderColor: colors.platinum,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  selectedFilter: {
    backgroundColor: colors.rosyBrown,
    borderColor: colors.rosyBrown,
    shadowColor: colors.rosyBrown,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  filterText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  selectedText: {
    color: colors.white,
    fontWeight: "700",
  },
});

export default FilterBar;
