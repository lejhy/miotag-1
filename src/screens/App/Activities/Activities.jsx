// @flow

import React, { useState, useEffect } from 'react';
import { SafeAreaView, RefreshControl } from 'react-native';
import styled from 'styled-components';

import useActivities from '@hooks/useActivities';
import { ScreenHeader } from '@core';

import ActivityItem from './ActivityItem';

const ScrollContainer = styled.ScrollView`
  height: 100%;
  padding: 5%;
`;

const Text = styled.Text``;

export default function Activities() {
  const [refreshing, setRefreshing] = useState(true);
  const [{ activities }, { refresh }] = useActivities();

  const refreshActivities = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  useEffect(() => {
    refreshActivities();
  }, []);

  return (
    <SafeAreaView>
      <ScreenHeader title="Activities" includeBackButton />
      <ScrollContainer
        refreshControl={(
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshActivities}
          />
        )}
      >
        { (!activities || activities.length === 0) && (
          <Text align="center">No activities to show</Text>
        ) }
        { (activities && activities.length > 0) && activities.map((a) => (
          <ActivityItem activity={a} key={a.id} />
        ))}
      </ScrollContainer>
    </SafeAreaView>
  );
}
