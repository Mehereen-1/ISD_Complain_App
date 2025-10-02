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
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[styles.filterButton, selectedFilter === filter && styles.selectedFilter]}
          onPress={() => onSelectFilter(filter)}
          activeOpacity={0.85}
        >
          <Text style={[styles.filterText, selectedFilter === filter && styles.selectedText]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.light,
    marginRight: 10,
    backgroundColor: colors.lightest,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.light,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  selectedFilter: {
    backgroundColor: colors.deep,
    borderColor: colors.deep,
    shadowColor: colors.deep,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  filterText: {
    color: "#222",
    fontWeight: "500",
    fontSize: 15,
    letterSpacing: 0.2,
  },
  selectedText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default FilterBar;
